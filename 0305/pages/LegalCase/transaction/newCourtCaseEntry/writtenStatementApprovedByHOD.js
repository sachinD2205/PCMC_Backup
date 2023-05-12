import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import sweetAlert from "sweetalert";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { toast } from "react-toastify";
import { GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";

// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
// import urls from "../../../../../URLS/urls";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
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
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [dptData, setDptData] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState();
  const [buttonText, setButtonText] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);
  const [departments, setDepartments] = useState([]);

  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [parawiseRequestByCaseEntry, setParawiseRequestByCaseEntry] = useState([]);
  const [parawiseEntryData, setParawiseEntryData] = useState([]);
  const [applicableDepartments, setApplicableDepartments] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      console.log("2313", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };

  const getCaseEntryData = () => {
    axios.get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`).then((res) => {
      console.log("getCaseEntryData", res.data);
      setCaseEntryData(res.data);
    });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getDptDataById = () => {
    // axios
    //   //   .get(`${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=29`)
    //   .get(
    //     `${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=${caseEntryData.parawiseReportFinalDepartmentIds}`,
    //   )
    //   .then((res) => {
    //     console.log("getDptDataById", res?.data);
    //     let departmentData = res?.data?.find((item) => item?.trnNewCourtCaseEntryDaoKey == router?.query?.id);
    //     setDptData(departmentData);
    //   });
  };

  useEffect(() => {
    console.log("router.query", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("fillingDate", router.query.fillingDate);
    getDepartments();
  }, []);

  useEffect(() => {
    getCaseEntryData();
    getParawiseRequestByCaseEntryId();
    getDptDataById();
  }, [departments]);

  // useEffect(() => {
  //   getDptDataById();
  // }, [caseEntryData]);

  useEffect(() => {
    console.log("dptData", dptData);
    console.log("caseEntryData", caseEntryData);

    // legal clerk
    setValue("parawiseReportRemarkClerk", caseEntryData?.parawiseReportRemarkClerk);
    setValue("parawiseReportRemarkClerkMr", caseEntryData?.parawiseReportRemarkClerkMr);
    // legal hod
    setValue("parawiseReportRemarkHod", caseEntryData?.parawiseReportRemarkHod);
    setValue("parawiseReportRemarkHodMr", caseEntryData?.parawiseReportRemarkHodMr);
    // conc dpt clerk
    setValue("clerkRemarkEnglish", dptData?.clerkRemarkEnglish);
    setValue("clerkRemarkMarathi", dptData?.clerkRemarkMarathi);
    // conc dpt hod
    setValue("hodRemarkEnglish", dptData?.hodRemarkEnglish);
    setValue("hodRemarkMarathi", dptData?.hodRemarkMarathi);

    // lawyerRemarkMr
    setValue("lawyerRemarkEn", caseEntryData?.lawyerRemarkEn);
    setValue("lawyerRemarkMr", caseEntryData?.lawyerRemarkMr);

    // get lawyaer remark en

    // return if caseEntryData is null
    if (!caseEntryData) return;

    let lawyerRemarkEnString = caseEntryData?.lawyerRemarkEn;

    console.log("lawyerRemarkEnString", lawyerRemarkEnString);

    // COnvert it to json array
    let lawyerRemarkEnJson = JSON.parse(lawyerRemarkEnString);

    // Iterate lawyerRemarkEnJson
    let tableData = lawyerRemarkEnJson?.map((item, index) => {
      return {
        id: index + 1,
        ...item,
      };
    });

    setParawiseEntryData(tableData);
  }, [dptData, caseEntryData]);

  // Save DB

  const onSubmitForm = (Data) => {
    const _data = {
      ...data,
      pageMode: "APPROVE",
      // hodRemarkEnglish:"null",
      //   noticeAttachment: selectedNoticeAttachmentToSend,
      id: router.query.id,
      finalAssignedDepartmentId: watch("departmentName"),
      finalAssignedRemarkByLegalHod: "finalAssignedRemarkByLegalHod",
      finalAssignedRemarkByLegalHodMr: "finalAssignedRemarkByLegalHodMr",
    };

    console.log("data", data);

    axios
      .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/approveWrittenStatementByHod`, _data, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .then((r) => {
        if (r.status == 201) {
          console.log("res save notice", r);
          swal("Record is Successfully Saved!", {
            icon: "success",
          });
          router.push({
            pathname: "/LegalCase/transaction/newCourtCaseEntry",
            query: { mode: "Create" },
          });
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  // //useeffect
  // useEffect(() => {
  //   console.log("watch", watch("departmentName"));
  // }, [watch("departmentName")]);

  //   for modal Api
  const onFinish = (data) => {
    const _data = {
      ...data,
      pageMode: "APPROVE",
      // hodRemarkEnglish:"null",
      //   noticeAttachment: selectedNoticeAttachmentToSend,
      id: router.query.id,
      finalAssignedDepartmentId: watch("departmentName"),
      finalAssignedRemarkByLegalHod: "finalAssignedRemarkByLegalHod",
      finalAssignedRemarkByLegalHodMr: "finalAssignedRemarkByLegalHodMr",
    };

    console.log("data", data);

    axios
      .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/approveWrittenStatementByHod`, _data, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .then((r) => {
        if (r.status == 201) {
          console.log("res save notice", r);
          swal("Record is Successfully Saved!", {
            icon: "success",
          });
          router.push({
            pathname: "/LegalCase/transaction/newCourtCaseEntry",
            query: { mode: "Create" },
          });
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  const getParawiseRequestByCaseEntryId = () => {
    axios
      .get(`${urls.LCMSURL}/parawiseRequest/getParawiseRequestByCaseEntryId?caseEntryId=${router.query.id}`)
      .then((res) => {
        console.log("getParawiseRequestByCaseEntryId", res.data);

        // add a new field in res.data called departmentName
        // iterate res.data
        let var1 = res.data.map((item) => {
          // refer to departments list to get department name
          return {
            departmentNameNew: departments.find((dept) => dept.id == item.departmentId)?.department,
            ...item,
          };
        });

        //setParawiseRequestByCaseEntry(res.data);

        setParawiseRequestByCaseEntry(var1);

        console.log("var1", var1);

        let finalTableData = [];
        // Iterate res.data
        res.data.map((item) => {
          // convert item.clerkRemarkEnglish to json array
          let id = item.id;
          let departmentId = item.departmentId;
          let clerkRemarkEnglishJson = JSON.parse(item.clerkRemarkEnglish);

          // iterate clerkRemarkEnglishJson
          clerkRemarkEnglishJson.map((clerkRemarkEnglishJsonItem) => {
            console.log("clerkRemarkEnglishJsonItem", clerkRemarkEnglishJsonItem);
            console.log("clerkRemarkEnglishJsonItem.issueNo", clerkRemarkEnglishJsonItem.issueNo);
            finalTableData.push({
              id: id,
              departmentId: departmentId,
              // refer to departments list to get department name
              departmentName: departments.find((dept) => dept.id == departmentId)?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });
          });
        });

        console.log("finalTableData", finalTableData);
        //setParawiseEntryData(finalTableData);

        // set applicableDepartments
        let depts = finalTableData.map((item) => {
          return {
            id: item.departmentId,
            department: departments.find((dept) => dept.id == item.departmentId)?.department,
          };
        });

        // deduce duplicate departments
        depts = depts.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

        setApplicableDepartments(depts);
      });
  };

  const columnsParaEntry = [
    {
      field: "departmentName",
      headerName: "Department Name",
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "issueNo",
      headerName: "Issue No",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "answerInEnglish",
      align: "center",
      headerAlign: "center",
      headerName: "Concern Department Clerk Remark in English",
      flex: 1,
    },
    {
      field: "writtenStatementInEnglish",
      align: "center",
      headerAlign: "center",
      headerName: "Written Statement in English",
      flex: 1,
    },
    {
      field: "answerInMarathi",
      align: "center",
      headerAlign: "center",
      headerName: "Concern Department Clerk Remark in Marathi",
      flex: 1,
    },
    {
      flex: 1,
      headerName: "Written Statement in Marathi",
      field: "writtenStatementInMarathi",
      align: "center",
      headerAlign: "center",
    },
  ];

  const columns = [
    {
      field: "departmentNameNew",
      headerName: "Department",
      align: "center",
      headerAlign: "center",
      width: 220,
    },

    // // {
    // //   // field: "id",
    // //   headerName:"Legal Clerk Remark",
    // //   align: "center",
    // //   headerAlign: "center",
    // //   // width: 120,
    // // },

    // // {
    // //   // field: "id",
    // //   headerName:"Legal HOD Remark",
    // //   align: "center",
    // //   headerAlign: "center",
    // //   // width: 120,
    // // },

    // {
    //   field: "clerkRemarkEnglish",
    //   align: "center",
    //   headerAlign: "center",

    //   headerName: "Concern Department Clerk Remark in English",
    //   flex: 1,
    // },
    // {
    //   flex: 1,
    //   // headerName: "Concern Department Clerk Remark",
    //   headerName: "Concern Department Clerk Remark in Marathi",

    //   field: "clerkRemarkMarathi",
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      flex: 1,
      headerName: "Concern Department HOD Remark in English",

      field: "hodRemarkEnglish",
      align: "center",
      headerAlign: "center",
    },
    {
      flex: 1,
      headerName: "Concern Department HOD Remark in Marathi",

      field: "hodRemarkMarathi",
      align: "center",
      headerAlign: "center",
    },
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
              {/* <FormattedLabel id="advWrittenStatememt" /> */}

              Approval for Written Statement 
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
              {/* court case no */}
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  sx={{ width: "90%" }}
                  autoFocus
                  disabled
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="courtCaseNumber" />}
                  variant="standard"
                  {...register("courtCaseNumber")}
                />
              </Grid>
              {/* case date */}
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth sx={{ width: "90%" }}>
                  <Controller
                    control={control}
                    name="fillingDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          disabled
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="caseDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
          {/* 2nd Row legal clerk remarks */}
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
                  // border:'solid red'
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                // label="Opinion"
                // label={<FormattedLabel id="clerkRemarkEn" />}
                label={
                  <FormattedLabel id="legalDeptRemarkEn"/>
                }
                // placeholder="Opinion"
                multiline
                variant="standard"
                fullWidth
                {...register("parawiseReportRemarkClerk")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("parawiseReportRemarkClerk") ? true : false) ||
                    (router.query.parawiseReportRemarkClerk ? true : false),
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
              sx={{
                marginTop: "30px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                // label="Opinion"
                // label={<FormattedLabel id="clerkRemarkMr" />}
                label={
                  <FormattedLabel id="legalDeptRemarkMr"/>
                }
                // placeholder="Opinion"
                multiline
                variant="standard"
                fullWidth
                // style={{ width: 1000 , marginTop:"30px"}}
                {...register("parawiseReportRemarkClerkMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("parawiseReportRemarkClerkMr") ? true : false) ||
                    (router.query.parawiseReportRemarkClerkMr ? true : false),
                }}
                error={!!errors.clerkRemarkEn}
                helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
              />
            </Grid>
          </Grid>

          {/*legal HOD Remarks */}

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                // label={<FormattedLabel id="hodRemarksEn" />}
                label={
                  <FormattedLabel id="legalHODRemarkEn"/>
                }
                multiline
                variant="standard"
                fullWidth
                {...register("parawiseReportRemarkHod")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("parawiseReportRemarkHod") ? true : false) ||
                    (router.query.parawiseReportRemarkHod ? true : false),
                }}
                error={!!errors.hodRemarkEn}
                helperText={errors?.hodRemarkEn ? errors.hodRemarkEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                // label={<FormattedLabel id="hodRemarksMr" />}
                label={
                  <FormattedLabel id="legalHODRemarkMr"/>
                }
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("parawiseReportRemarkHodMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("parawiseReportRemarkHodMr") ? true : false) ||
                    (router.query.parawiseReportRemarkHodMr ? true : false),
                }}
                error={!!errors.hodRemarkMr}
                helperText={errors?.hodRemarkMr ? errors.hodRemarkMr.message : null}
              />
            </Grid>
          </Grid>

          {/* Add a Table below representing parawiseRequestByCaseEntry */}
          <Grid container sx={{ padding: "10px" }}>
            <h1>Department Clerk Parawise Remarks</h1>
            <Grid item xs={12} xl={12} md={12} sm={12} sx={{}}>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight
                sx={{
                  border: "1px solid",
                  borderColor: "blue",

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
                pagination
                paginationMode="server"
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={parawiseEntryData}
                columns={columnsParaEntry}
                onPageChange={(_data) => {
                  // getCaseType(data.pageSize, _data);
                  getAdvocate(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAdvocate(_data, data.page);
                }}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <h1>Department HOD Remarks</h1>
            <Grid item xs={12} xl={12} md={12} sm={12} sx={{}}>
              <DataGrid
                {...data}
                // disableColumnFilter
                // disableColumnSelector
                // disableToolbarButton
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
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
                  border: "1px solid",
                  borderColor: "blue",

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
                rows={parawiseRequestByCaseEntry}
                columns={columns}
                onPageChange={(_data) => {
                  // getCaseType(data.pageSize, _data);
                  getAdvocate(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAdvocate(_data, data.page);
                }}
              />
            </Grid>
          </Grid>

          {/* cons dpt clerk Remarks */}
          {/* 
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("clerkRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkEnglish") ? true : false) ||
                    (router.query.clerkRemarkEnglish ? true : false),
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
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.clerkRemarkMr}
                helperText={errors?.clerkRemarkMr ? errors.clerkRemarkMr.message : null}
              />
            </Grid>
          </Grid> }

          {/* cons dpt hod Remarks */}
          {/* <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="hodRemarksEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("hodRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("hodRemarkEnglish") ? true : false) ||
                    (router.query.hodRemarkEnglish ? true : false),
                }}
                error={!!errors.hodRemarksEn}
                helperText={errors?.hodRemarksEn ? errors.hodRemarksEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="hodRemarksMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("hodRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("hodRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.hodRemarksMr}
                helperText={errors?.hodRemarksMr ? errors.hodRemarksMr.message : null}
              />
            </Grid>
          </Grid> */}
          {/* Advocate written statement
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="writtenStatememtEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("lawyerRemarkEn")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("lawyerRemarkEn") ? true : false) || (router.query.lawyerRemarkEn ? true : false),
                }}
                error={!!errors.writtenStatememtEn}
                helperText={errors?.writtenStatememtEn ? errors.writtenStatememtEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="writtenStatememtMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("lawyerRemarkMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("lawyerRemarkMr") ? true : false) || (router.query.lawyerRemarkMr ? true : false),
                }}
                error={!!errors.writtenStatememtMr}
                helperText={errors?.writtenStatememtMr ? errors.writtenStatememtMr.message : null}
              />
            </Grid>
          </Grid> */}

          {/*  Department name */}
          <Grid
            container
            sx={{
              marginTop: "10px",
            }}
          >
            <Grid
              item
              // xs={12}
              xs={4}
              // sm={5}
              // md={5}
              // lg={5}
              // xl={5}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl sx={{ marginTop: 2 }} error={!!errors?.year} fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="deptName" />
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={<FormattedLabel id="deptName" />}
                      // placeholder="Select Department Name"
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}
                      onChange={(value) => {
                        field.onChange(value);
                        // setSelectedDepartment(
                        //   value.target.value
                        // );
                      }}
                      style={{ backgroundColor: "white" }}
                    >
                      {applicableDepartments.length > 0
                        ? applicableDepartments.map((dept, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={dept.id}
                                style={{
                                  display: dept.department ? "flex" : "none",
                                }}
                              >
                                {/* {user.department} */}

                                {language == "en" ? dept?.department : dept?.departmentMr}
                              </MenuItem>
                            );
                          })
                        : []}
                    </Select>
                  )}
                  name="departmentName"
                  // name="department"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Final Approval Remark From Legal HOD */}

          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12} xl={12} md={12} sm={12}>
              <TextField
                id="standard-textarea"
                // label={<FormattedLabel id="hodRemarksEn" />}
                label="Final Approval Remark From Legal HOD (In English)"
                multiline
                variant="standard"
                fullWidth
                {...register("finalAssignedRemarkByLegalHod")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("finalAssignedRemarkByLegalHod") ? true : false) ||
                    (router.query.finalAssignedRemarkByLegalHod ? true : false),
                }}
                error={!!errors.finalAssignedRemarkByLegalHod}
                helperText={
                  errors?.finalAssignedRemarkByLegalHod ? errors.finalAssignedRemarkByLegalHod.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                // label={<FormattedLabel id="hodRemarksMr" />}
                label="Final Approval Remark From Legal HOD (In Marathi)"
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("finalAssignedRemarkByLegalHodMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("finalAssignedRemarkByLegalHodMr") ? true : false) ||
                    (router.query.finalAssignedRemarkByLegalHodMr ? true : false),
                }}
                error={!!errors.finalAssignedRemarkByLegalHodMr}
                helperText={
                  errors?.finalAssignedRemarkByLegalHodMr
                    ? errors.finalAssignedRemarkByLegalHodMr.message
                    : null
                }
              />
            </Grid>
          </Grid>

          {/* Button Row */}

          <Grid
            container
            mt={10}
            ml={5}
            mb={5}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
            xs={12}
          >
            <Button
              variant="contained"
              size="small"
              type="submit"
              // onClick={() => setButtonText("Approve")}

              sx={{ backgroundColor: "#00A65A" }}
              name="Approve"
              endIcon={<TaskAltIcon />}
            >
              {/* <FormattedLabel id="submit" /> */}
              Approve
            </Button>
            {/* <Button
              variant="contained"
              size="small"
              //   type="submit"
              onClick={() => setButtonText("Reassign")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button> */}
            <Button
              size="small"
              variant="contained"
              sx={{ backgroundColor: "#DD4B39" }}
              endIcon={<CloseIcon />}
              onClick={() => {
                router.push("/LegalCase/transaction/newCourtCaseEntry");
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>

          {/* for modal */}
          {/* */}
        </Paper>
      </form>
    </>
  );
};

export default Index;
