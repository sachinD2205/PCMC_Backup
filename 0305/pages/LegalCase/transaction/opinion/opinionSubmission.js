import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
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
  Typography,
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
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSubmissionSchema";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTable";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    watch,
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
  const token = useSelector((state) => state.user.user.token);

  const [personName1, setPersonName1] = React.useState([]);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  // const [id,setId]= useState();
  // const getApproveOpinion = () => {
  //   axios.get
  //   reset(res.data)
  // }

  useEffect(() => {
    axios.get(`${urls.LCMSURL}/master/advocate/getAll`).then((res) => {
      setAdvocateNames(
        res.data.advocate.map((r, i) => ({
          id: r.id,
          advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
          advocateNameMr: r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
        })),
      );
    });
  }, []);

  useEffect(() => {
    //reset(router.query);
    console.log("router", router.query);

    axios.get(`${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`).then((r) => {
      console.log("datafromaxios", r);
      console.log("trnOpinionAttachmentDao1", r.data.trnOpinionAttachmentDao);

      reset(r.data);

      let _dataList = r.data.trnOpinionAttachmentDao.map((val) => {
        console.log("wfdc", val);
        return {
          id: val.id,
          srNo: val.id,
          attachedDate: "2023-03-01",
          uploadedBy: val.attachedNameEn ? val.attachedNameEn : "-",
          attachmentNameMr: null,
          attachedNameEn: "",
          extension: val.extension ? val.extension : "-",
          originalFileName: val.originalFileName ? val.originalFileName : "-",
          filePath: val.filePath,
        };
      });

      _dataList !== null && setMainFiles([..._dataList]);

      let _res = r.data.opinionAdvPanelList.map((r, i) => {
        return {
          ...r,
          srNo: i + 1,
          advocate: advocateNames?.find((a) => a?.id === r?.advocate)?.advocateName,
          advocateOpinion: r.opinion,
          advocateOpinionMr: r.opinionMr,
        };
      });
      // setData(_res)
      setData({
        rows: _res,
        totalRows: r.data.opinionAdvPanelList.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 100,
        page: 0,
      });

      let _res1 = r.data.reportAdvPanelList.map((r, i) => {
        return {
          srNo: i + 1,
          advocate: advocateNames?.find((a) => a?.id === r?.advocate)?.advocateName,
          advocateOpinion: r.opinion,
          advocateOpinionMr: r.opinionMr,
          // advocateOpinion: r.opinion,
        };
      });
      // setData(_res)
      setData1({
        rows: _res1,
        totalRows: r.data.reportAdvPanelList.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 100,
        page: 0,
      });

      // console.log("getValues",getValues("opinionAdvPanelList"));
    });
    // setId(router.query.id)
    //  getApproveOpinion()
  }, [router.query, advocateNames]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName1(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
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

  const [data1, setData1] = useState({
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
    // getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  // Save DB

  const onSubmitForm = (Data) => {
    console.log("data", Data);

    let body = {
      ...Data,
      // opinionAdvPanelList: personName.map((val) => {
      // console.log("val",val);
      // return {
      // advocate: val,
      // };
      // console.log("id", id);
      // }),

      role: "OPINION_SUBMISSION",
      status: "OPINION_SUBMITTED",

      // pageMode:
      // data.target.textContent === "Submit" ? "OPINION_SUBMISSION" : "OPINION_APPROVE",

      // reportAdvPanelList: personName1.map((val) => {
      //   return {
      //     advocate: val,
      //   };
      // }),
      // courtCaseEntryId: Number(Data?.id),
      // id: null,
      // sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      //name
      // id:router.query.pageMode=='Opinion' ? null: Data.id,
      // courtCaseEntryId:router.query.pageMode=='Opinion' ? Data.id:null
    };

    console.log("bodyclkopsub", body);

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

  const getDeptName = () => {
    // alert("HEllo");
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setconcenDeptName(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
        })),
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
        })),
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
          axios.post(`${urls.LCMSURL}/transaction/opinion/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getSubType()
              // getAllOpinion();
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
          axios.post(`${urls.LCMSURL}/transaction/opinion/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getSubType()
              // getAllOpinion();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 70,
    },

    {
      // headerName: <FormattedLabel id="opinionRequestDate" />,
      headerName: "Advocate Name",
      field: "advocate",
      flex: 1,
    },

    {
      // headerName: <FormattedLabel id="locationName" />,
      headerName: "Advocate Opinion",
      field: "advocateOpinion",
      flex: 1,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     console.log("234t", params.row);
    //     return (
    //       <>
    //         <IconButton onClick={() => {}}>
    //           <VisibilityIcon />
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
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
              <FormattedLabel id="clerkOpinion" />
              {/* Opinion approval For Clerk */}
            </h2>
          </Box>

          <Divider />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 10,
              }}
            ></div>

            {/* First Row */}

            <Grid container sx={{ padding: "10px" }}>
              {/* Case Number */}
              {/* <Grid
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
                InputLabelProps={{
                  shrink: //true
                    (watch("caseNumber") ? true : false) ||
                    (router.query.caseNumber ? true : false),
                }}
              />
            </Grid> */}

              {/* Filed By */}
              {/* <Grid
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

                InputLabelProps={{
                  shrink: //true
                    (watch("filedBy") ? true : false) ||
                    (router.query.filedBy ? true : false),
                }}
              />
            </Grid> */}

              {/* Case Details */}
              {/* <Grid
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
                InputLabelProps={{
                  shrink: //true
                    (watch("caseDetails") ? true : false) ||
                    (router.query.caseDetails ? true : false),
                }}
              />
            </Grid> */}
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
                <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.opinionRequestDate}>
                  <Controller
                    // variant="standard"
                    control={control}
                    name="opinionRequestDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // disabled={router?.query?.pageMode === "View"}
                          disabled
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {/* Opinion Request Date */}

                              {<FormattedLabel id="opinionRequestDate" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              disabled
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ width: 230 }}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },

                                //true
                                shrink:
                                  (watch("opinionRequestDate") ? true : false) ||
                                  (router.query.opinionRequestDate ? true : false),
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.opinionRequestDate ? errors.opinionRequestDate.message : null}
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
                  disabled
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
                        // disabled={router?.query?.pageMode === "View"}
                        disabled
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="locationName" />}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("locationName") ? true : false) ||
                            (router.query.locationName ? true : false),
                        }}
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
                  disabled
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
                        // disabled={router?.query?.pageMode === "View"}
                        disabled
                        sx={{ width: 230 }}
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

                              {language == "en" ? department?.department : department?.departmentMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="concenDeptId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.concenDeptId ? errors.concenDeptId.message : null}</FormHelperText>
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
                  // disabled={router?.query?.pageMode === "View"}
                  disabled
                  id="standard-textarea"
                  // label="Opinion Subject"
                  label={<FormattedLabel id="opinionSubject" />}
                  placeholder="Opinion Subject"
                  multiline
                  variant="standard"
                  style={{ width: 200 }}
                  {...register("opinionSubject")}
                  InputLabelProps={{
                    //true
                    shrink:
                      (watch("opinionSubject") ? true : false) ||
                      (router.query.opinionSubject ? true : false),
                  }}
                  error={!!errors.opinionSubject}
                  helperText={errors?.opinionSubject ? errors.opinionSubject.message : null}
                />
              </Grid>
            </Grid>

            {/* </Paper> */}

            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                marginTop: "10px",
                // backgroundColor:'#0E4C92'
                // backgroundColor:'		#0F52BA'
                // backgroundColor:'		#0F52BA'
                background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                {" "}
                <FormattedLabel id="opinionForPanelAdvocate" />
                {/* Opinion For Panel Advocate */}
              </h2>
            </Box>

            <Box
              sx={
                {
                  // height: 200,
                  // width: 1000,
                  // marginLeft: 10,
                  // width: '100%',
                  // overflowX: 'auto',
                }
              }
            >
              <DataGrid
                getRowId={(row) => row.srNo}
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
                  // getAllOpinion(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  // getAllOpinion(_data, data.page);
                }}
              />
            </Box>

            <Box
              style={{
                marginTop: "40px",
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
                <FormattedLabel id="opinionForSearchTitleReport" />
                {/* Opinion For Report Title Advocate */}
              </h2>
            </Box>

            <Box
              sx={
                {
                  // height: 200,
                  // width: 1000,
                  // marginLeft: 10,
                  // width: '100%',
                  // overflowX: 'auto',
                }
              }
            >
              <DataGrid
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
                rowCount={data1.totalRows}
                rowsPerPageOptions={data1.rowsPerPageOptions}
                page={data1.page}
                pageSize={data1.pageSize}
                rows={data1.rows}
                columns={columns}
                onPageChange={(_data1) => {
                  // getCaseType(data.pageSize, _data);
                  // getAllOpinion(data1.pageSize, _data1);
                }}
                onPageSizeChange={(_data1) => {
                  console.log("222", _data1);
                  // updateData("page", 1);
                  // getAllOpinion(_data1, data1.page);
                }}
              />
            </Box>
          </div>
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography style={{ fontWeight: 900, fontSize: "20px" }}>Opinion Attachment</Typography>
            </Grid>
            <Grid item xs={12}>
              <FileTable
                appName="LCMS" //Module Name
                serviceName={"L-Notice"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                uploading={setUploading}
                showNoticeAttachment={router.query.showNoticeAttachment}
              />
            </Grid>
          </Grid>

          {/* Fourth Row */}
          <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                // label=" Clerk Opinion"

                label={<FormattedLabel id="clerkRemarkEn" />}
                // placeholder="Opinion"
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkEn")}
                InputLabelProps={{
                  //tru
                  shrink:
                    (watch("clerkRemarkEn") ? true : false) || (router.query.clerkRemarkEn ? true : false),
                }}
                error={!!errors.clerkRemarkEn}
                helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                // label=" Clerk Opinion (In Marathi)"
                label={<FormattedLabel id="clerkRemarkMr" />}
                // placeholder="Opinion"
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkMr") ? true : false) || (router.query.clerkRemarkMr ? true : false),
                }}
                error={!!errors.clerkRemarkMr}
                helperText={errors?.clerkRemarkMr ? errors.clerkRemarkMr.message : null}
              />
            </Grid>

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

                              shrink: //true
                                (watch("opinionSubmisionDate") ? true : false) ||
                                (router.query.opinionSubmisionDate ? true : false),
                         
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
          </Grid> */}
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
              <Button variant="contained" onClick={() => router.push(`/LegalCase/transaction/opinion/`)}>
                {/* Cancel */}

                {<FormattedLabel id="cancel" />}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default Index;
