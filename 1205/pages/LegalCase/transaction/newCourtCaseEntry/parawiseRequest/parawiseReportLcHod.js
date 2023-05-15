import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import { Button, Divider, FormControl, Grid, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import urls from "../../../../../URLS/urls";
// import { parawiseReportForClerk } from "../../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { default as swal, default as sweetAlert } from "sweetalert";



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
    // resolver: yupResolver(parawiseReportForClerk),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [dptList, setDptList] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState([]);
  const [buttonText, setButtonText] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    console.log("router.query", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("fillingDate", router.query.fillingDate);
  }, []);

  useEffect(() => {
    getDeptNameById();
    getDptName();
    getCaseEntryData();
  }, []);
  useEffect(() => {
    getDeptNameById();
    setValue("parawiseReportRemarkClerkMr", caseEntryData?.parawiseReportRemarkClerkMr);
    setValue("parawiseReportRemarkClerk", caseEntryData?.parawiseReportRemarkClerk);
  }, [caseEntryData, dptList]);

  // Save DB
  const onSubmitForm = (Data) => {
    console.log("data", Data);
    let body = {
      id: router.query.id,
      parawiseReportRemarkHod: Data.parawiseReportRemarkHod,
      parawiseReportRemarkHodMr: Data.parawiseReportRemarkHodMr,
        // caseStatus:
        //   buttonText === "Approve"
        //     ? "PARAWISE_APPROVED_BY_HOD"
        //     : buttonText === "Reassign"
        //     ? "PARAWISE_RPT_REASSIGNED_TO_LEGAL_CLERK"
        //     : router.query.caseStatus,

        //  caseStatus:

    };
    console.log("body", body);

    if(buttonText == "Approve"){

      axios
      .post(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportAssignDepartmentsApprovedByHod`,
        body,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        },
      )
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });

    }
    else{
      axios
      .post(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportReassignedByLegalHod`,
        body,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        },
      )
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });
    }
    // axios
    //   .post(
    //     `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportAssignDepartmentsApprovedByHod`,
    //     body,
    //     {
    //       // headers: {
    //       //   Authorization: `Bearer ${token}`,
    //       // },
    //     },
    //   )
    //   .then((res) => {
    //     console.log("res123", res);
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Submitted successfully !", "success");
    //       router.push(`/LegalCase/transaction/newCourtCaseEntry`);
    //     }
    //   });
  };

  // for Rassign 
  // const reassign = (Data) => {
  //   console.log("data", Data);
  //   let body = {
  //     id: router.query.id,
  //     parawiseReportRemarkHod: Data.parawiseReportRemarkHod,
  //     parawiseReportRemarkHodMr: Data.parawiseReportRemarkHodMr,
       

  //   };
  //   console.log("body", body);
  //   axios
  //     .post(
  //       `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportReassignedByLegalHod`,
  //       body,
  //       {
  //         // headers: {
  //         //   Authorization: `Bearer ${token}`,
  //         // },
  //       },
  //     )
  //     .then((res) => {
  //       console.log("res123", res);
  //       if (res.status == 200) {
  //         sweetAlert("Saved!", "Record Submitted successfully !", "success");
  //         router.push(`/LegalCase/transaction/newCourtCaseEntry`);
  //       }
  //     });
  // };


  const getDptName = () => {
    axios.get(`${urls.LCMSURL}/master/department/getAll`).then((res) => {
      let _data = res.data.department;
      //   console.log("KKKKKKKK", _data);
      setDptList(_data);
    });
  };

  const getCaseEntryData = () => {
    axios.get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`).then((res) => {
      console.log("res", res.data);
      setCaseEntryData(res.data);
    });
  };

  const getDeptNameById = () => {
    axios.get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`).then((res) => {
      console.log("res", res.data);
      let _res = res.data.parawiseReportProvisionalDepartmentIds.split(",");
      console.log("_res", _res);
      let a = _res.map((item, index) => {
        return {
          id: index,
          srNo: index + 1,
          departmentNameEn: dptList?.find((obj) => obj.id == item)?.department,
          departmentNameMr: dptList?.find((obj) => obj.id == item)?.departmentMr,
        };
      });
      setTableData(a);
    });
  };

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      minWidth: 250,
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
              <FormattedLabel id="hodRemarks" />
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

          {/* 2nd table Row */}
          <Grid container sx={{ padding: "10px" }} mt={5} mb={5}>
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
          </Grid>

          {/* 3rd Row */}
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
                label={<FormattedLabel id="clerkRemarkEn" />}
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
                label={<FormattedLabel id="clerkRemarkMr" />}
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

          {/* HOD Remarks */}

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
                disabled={router?.query?.pageMode === "View"}
                // label="HOD Opinion"
                label={<FormattedLabel id="hodRemarksEn" />}
                // placeholder="Opinion"
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("parawiseReportRemarkHod")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("parawiseReportRemarkHod") ? true : false) ||
                    (router.query.parawiseReportRemarkHod ? true : false),
                }}
                error={!!errors.parawiseReportRemarkHod}
                helperText={errors?.parawiseReportRemarkHod ? errors.parawiseReportRemarkHod.message : null}
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
                disabled={router?.query?.pageMode === "View"}
                // label="HOD Opinion in Marathi"
                label={<FormattedLabel id="hodRemarksMr" />}
                // placeholder="Opinion"
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
                error={!!errors.parawiseReportRemarkHodMr}
                helperText={errors?.parawiseReportRemarkHodMr ? errors.parawiseReportRemarkHodMr.message : null}
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
              onClick={() => setButtonText("Approve")}
              type="submit"
              sx={{ backgroundColor: "#00A65A" }}
              name="Approve"
              endIcon={<TaskAltIcon />}
            >
              <FormattedLabel id="approve" />
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setButtonText("Reassign")}
              // onClick={()=>reassign()}
              type="submit"
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button>
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
