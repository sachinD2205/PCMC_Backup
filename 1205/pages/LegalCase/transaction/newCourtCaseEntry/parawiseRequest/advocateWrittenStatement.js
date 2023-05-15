import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import { Button, Divider, FormControl, Grid, Paper, TextField } from "@mui/material";
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
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import DeleteIcon from "@mui/icons-material/Delete";
import urls from "../../../../../URLS/urls";

import styles from "../../../../../styles/LegalCase_Styles/parawiseReport.module.css"

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
  const [parawiseRequestByCaseEntry, setParawiseRequestByCaseEntry] = useState([]);
  const [parawiseEntryData, setParawiseEntryData] = useState([]);
  const [departments, setDepartments] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "parawiseRequestDao", // unique name for your Field Array
  });

  const getCaseEntryData = () => {
    axios.get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`).then((res) => {
      console.log("getCaseEntryData", res.data);
      setCaseEntryData(res.data);
    });
  };

  // departments
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
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
          let clerkRemarkEnglishJson = JSON.parse(item.clerkRemarkEnglish);

          // iterate clerkRemarkEnglishJson
          clerkRemarkEnglishJson.map((clerkRemarkEnglishJsonItem) => {
            finalTableData.push({
              id: item.id,
              departmentId: item.departmentId,
              // refer to departments list to get department name
              departmentName: departments.find((dept) => dept.id == item.departmentId)?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });

            console.log("loopdata", item.departmentId, clerkRemarkEnglishJsonItem.issueNo);
            append({
              departmentName: departments.find((dept) => dept.id == item.departmentId)?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });
          });
        });

        console.log("finalTableData", finalTableData);
        setParawiseEntryData(finalTableData);
      });
  };

  // // get Parawise from legal clerk
  // const getParawiseFromLegal = () => {
  //   axios
  //     .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAllBynewCourtCaseEntryId?caseEntryId=${router.query.id}`)
  //     .then((res) => {
  //       console.log("getParawiseRequestByCaseEntryId", res.data);
  //       setParawiseRequestByCaseEntry(res.data);
  //     });
  // };

  const getDptDataById = () => {
    axios
      .get(`${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=${router.query.departmentId}`)
      .then((res) => {
        let departmentData = res?.data?.find(
          (item) => item?.trnNewCourtCaseEntryDaoKey == router?.query?.caseEntryId,
        );
        //   console.log("depardatagridtmentData", departmentData);
        setDptData(departmentData);
      });
  };

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // // Columns for Department List
  // const _col = [
  //   {
  //     field: "srNo",
  //     headerName: <FormattedLabel id="srNo" />,
  //     width: 150,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: language === "en" ? "departmentNameEn" : "departmentNameMr",
  //     headerName: <FormattedLabel id="deptName" />,
  //     flex: 1,
  //     minWidth: 250,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  // ];

  const columns = [
    // {
    //   field: "id",
    //   headerName: "id",
    //   align: "center",
    //   headerAlign: "center",
    //   // width: 120,
    // },
    {
      // set filed as departmentName | derrive it from departments and departmentId
      field: "departmentNameNew",
      headerName: "Department Name",
      align: "center",
      headerAlign: "center",
      width: 220,
    },

    // {
    //   // field: "id",
    //   headerName:"Legal Clerk Remark",
    //   align: "center",
    //   headerAlign: "center",
    //   // width: 120,
    // },

    // {
    //   // field: "id",
    //   headerName:"Legal HOD Remark",
    //   align: "center",
    //   headerAlign: "center",
    //   // width: 120,
    // },

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
      flex: 1,
      headerName: "Concern Department Clerk Remark in Marathi",
      field: "answerInMarathi",
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    console.log("router.query", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("fillingDate", router.query.fillingDate);
    getDepartments();
  }, []);

  useEffect(() => {
    getCaseEntryData();
    getParawiseRequestByCaseEntryId();
  }, [departments]);

  useEffect(() => {
    getDptDataById();
  }, [caseEntryData]);
  useEffect(() => {
    console.log("dptData", dptData);

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
  }, [dptData, caseEntryData]);

  useEffect(() => {
    getDptDataById();
  }, []);
  useEffect(() => {
    setValue("clerkRemarkEnglish", dptData?.clerkRemarkEnglish);
    setValue("clerkRemarkMarathi", dptData?.clerkRemarkMarathi);
    if (router.query.pageMode == "View") {
      setValue("hodRemarkEnglish", dptData?.hodRemarkEnglish);
      setValue("hodRemarkMarathi", dptData?.hodRemarkMarathi);
    }
  }, [dptData]);

  // Save DB

  const onSubmitForm = (Data) => {
    let finalData = JSON.stringify(Data.parawiseRequestDao);
    console.log("data", Data);
    console.log("finalData", finalData);
    let body = {
      id: caseEntryData.id,
      lawyerRemarkEn: finalData,
      lawyerRemarkMr: finalData,
    };
    console.log("body", body);
    axios
      .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/createWrittenStatementByLawyer`, body, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .then((res) => {
        console.log("createWrittenStatementByLawyer", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        } else if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });
  };

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
              <FormattedLabel id="advWrittenStatememt" />
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

          {/* Grid for Department List */}
          {/* <Grid container sx={{ padding: "10px" }} mt={5} mb={5}>
            <DataGrid
              sx={{
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
              autoHeight={true}
              hideFooter={true}
              pagination
              paginationMode="server"
              rows={tableData}
              columns={_col}
              onPageChange={(_data) => {}}
              onPageSizeChange={(_data) => {}}
            />
          </Grid> */}

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

          {/* cons dpt clerk Remarks */}

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
          </Grid> */}

          {/* cons dpt hod Remarks
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

          {/* <h1>Parawise Remark</h1> */}
          <h1>
          <FormattedLabel id="parawiseRemark" />

          </h1>

          <Box
            sx={{
              border: "0.1rem outset black",
              marginTop: "10px",
            }}
          >
            <Grid container
             className={styles.theme1}
            >
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>Point No</h3>
              </Grid>
              <Grid
                item
                xs={10}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>Points Explanation</h3>
              </Grid>
            </Grid>
            <Box
              overflow="auto"
              height={450}
              flex={1}
              flexDirection="column"
              display="flex"
              p={2}
              padding="0px"
              // sx={{
              //   border: "0.2rem outset black",
              //   marginTop:"10px"
              // }}
            >
              {fields.map((parawise, index) => {
                return (
                  <>
                    <Grid container component={Box} style={{ marginTop: 20 }}>
                      <Grid item xs={0.1}></Grid>

                      <Grid item xs={1.5} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          disabled
                          placeholder="Issue No"
                          size="small"
                          type="number"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.issueNo`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.2}></Grid>
                      {/* para for english */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          disabled
                          // rows="1"
                          // style={{ width: 500 }}
                          style={{
                            // background:"red"

                            border: "1px  solid",
                          }}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.answerInEnglish`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.3}></Grid>

                      {/* para for Marathi */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          disabled
                          // rows="1"
                          // style={{ width: 500 }}
                          style={{
                            // background:"red"

                            border: "1px  solid",
                          }}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.answerInMarathi`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.4}></Grid>
                    </Grid>
                    <Grid container component={Box} style={{ marginTop: 20 }}>
                      <Grid item xs={1.6}></Grid>

                      <Grid item xs={0.2}></Grid>
                      {/* para for english */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          // rows="1"
                          // style={{ width: 500 }}
                          style={{
                            // background: " #555555",
                            backgroundColor: "LightGray",
                            // background: "#e7e7e7",
                            // border: "2px solid #4CAF50",
                            // opacity: 1,
                            // background:"	#87CEEB",
                            border: "1px solid",
                          
                          }}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please Enter Written Statement Here (In English)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.writtenStatementInEnglish`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.3}></Grid>

                      {/* para for Marathi */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          // rows="1"
                          // style={{ width: 500 }}
                          style={{
                            // background: " #555555",
                            backgroundColor: "LightGray",
                            // background: "#e7e7e7",
                            // border: "2px solid #4CAF50",
                            // opacity: 1,
                            // background:"	#87CEEB",
                            border: "1px solid",
                          
                          }}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please Enter Written Statement Here (In Marathi)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.writtenStatementInMarathi`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.4}></Grid>
                    </Grid>
                  </>
                );
              })}
              {/* </ThemeProvider> */}
            </Box>
          </Box>

          {/* Advocate written statement */}
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
                // disabled
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
                // disabled
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
              onClick={() => setButtonText("Approve")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Approve"
              endIcon={<TaskAltIcon />}
            >
              <FormattedLabel id="submit" />
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
        </Paper>
      </form>
    </>
  );
};

export default Index;
