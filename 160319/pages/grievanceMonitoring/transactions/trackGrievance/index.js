import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  FormHelperText,
} from "@mui/material";
import React, { useEffect } from "react";
import theme from "../../../../theme";
import styles from "../../../../components/grievanceMonitoring/view.module.css";
import { Controller, useForm } from "react-hook-form";
import swal from "sweetalert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });
  const logedInUser = localStorage.getItem("loggedInUser");

  const router = useRouter();

  const getGrievanceById = (_pageSize = 10, _pageNo = 0) => {
    axios.get(`${urls.GM}/trnRegisterComplaint/getComplaintById?id=${watch("grievanceId")}`).then((res) => {
      let result = res?.data;
      console.log("42", result.id);
      setValue("grievanceRaiseDate", result.grievanceDate);
      setValue("grievanceId", result.id);
      setValue("complaintStatusText", result.complaintStatusText);
      setValue("board", result.location);
      setValue("subject", result.subject);
      setValue("complaintDescription", result.complaintDescription);
      setValue("complaintType", result.complaintType);
      setValue("deptName", result.deptName);
      setValue("subDepartmentText", result.subDepartmentText);
      setValue("firstName", result.firstName);
      setValue("middleName", result.middleName);
      setValue("surname", result.surname);
      setValue("fullName", result.firstName + " " + result.middleName + " " + result.surname);

      // let _res = result?.map((val) => {
      //   setValue("grievanceRaiseDate", val.grievanceDate)
      //   console.log(":3", val.grievanceDate)
      //   return {
      //     activeFlag: val.activeFlag,
      //     id: val.id,
      //     srNo: i + 1,
      //     grievanceDate: val.grievanceDate,
      //     complaintStatus: val.complaintStatus,
      //     meetingPlace: val.meetingPlace,
      //     remark: val.description,
      //   }
      // })
      // setData({
      //   rows: _res,
      //   totalRows: res.data.totalElements,
      //   rowsPerPageOptions: [10, 20, 50, 100],
      //   pageSize: res.data.pageSize,
      //   page: res.data.pageNo,
      // })
      // return _res
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (watch("grievanceId") === "") {
      setValue("grievanceRaiseDate", "");
      setValue("complaintStatusText", "");
      setValue("board", "");
      setValue("subject", "");
      setValue("complaintDescription", "");
      setValue("complaintType", "");
      setValue("deptName", "");
      setValue("subDepartmentText", "");
      setValue("firstName", "");
      setValue("middleName", "");
      setValue("surname", "");
      setValue("fullName", "");
    }
  }, [watch("grievanceId")]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "white",
                fontSize: 19,
                fontWeight: 500,
                // borderRadius: 100,
              }}
            >
              <strong className={styles.fancy_link1}>
                <FormattedLabel id="trackGrievance" />
              </strong>
            </Box>
          </Box>

          {/* /////////////////////////////////////////////// */}
          <div>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: 15,
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "10vw" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="grievanceId" />}
                  placeholder="search by greivance id"
                  variant="standard"
                  {...register("grievanceId")}
                />
                <Button
                  onClick={() => {
                    if (watch("grievanceId")) {
                      //   alert("clicked")
                      getGrievanceById();
                    } else {
                      sweetAlert({
                        title: "OOPS!",
                        text: "Please Enter The Grievance-Id first",
                        icon: "warning",
                        dangerMode: true,
                        closeOnClickOutside: false,
                      });
                    }
                  }}
                  size="small"
                >
                  <FormattedLabel id="getDetails" />
                </Button>
              </Grid>
            </Grid>
          </div>

          {/* /////////////////////////////////////////////// */}
          <div>
            <form>
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
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
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="fullName" />}
                    InputLabelProps={{
                      shrink: watch("fullName") ? true : false,
                    }}
                    {...register("fullName")}
                  />
                </Grid>

                {/* //////////////////////////////Name////////////////////// */}
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
                  <FormControl style={{ backgroundColor: "white" }} error={!!errors.grievanceRaiseDate}>
                    <Controller
                      control={control}
                      name="grievanceRaiseDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="grievanceRaiseDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.grievanceRaiseDate ? errors.grievanceRaiseDate.message : null}
                    </FormHelperText>
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
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="complaintStatusText" />}
                    InputLabelProps={{
                      shrink: watch("complaintStatusText") ? true : false,
                    }}
                    {...register("complaintStatusText")}
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
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="departmentName" />}
                    InputLabelProps={{
                      shrink: watch("deptName") ? true : false,
                    }}
                    variant="standard"
                    {...register("deptName")}
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
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="subDepartmentName" />}
                    InputLabelProps={{
                      shrink: watch("subDepartmentText") ? true : false,
                    }}
                    variant="standard"
                    {...register("subDepartmentText")}
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
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="complaintType" />}
                    InputLabelProps={{
                      shrink: watch("complaintType") ? true : false,
                    }}
                    variant="standard"
                    {...register("complaintType")}
                  />
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
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    InputLabelProps={{
                      shrink: watch("subject") ? true : false,
                    }}
                    sx={{ width: "88%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="subjects" />}
                    variant="standard"
                    {...register("subject")}
                  />
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
                  <TextField
                    disabled
                    label={<FormattedLabel id="complaintDescription" />}
                    multiline
                    sx={{ width: "88%" }}
                    // maxlength="50"
                    InputLabelProps={{
                      shrink: watch("complaintDescription") ? true : false,
                    }}
                    id="standard-basic"
                    // label="Complaint Description"
                    variant="standard"
                    {...register("complaintDescription")}
                  />
                </Grid>
              </Grid>

              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* ........................................ */}
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    // style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={() => {
                      // router.push({
                      //   pathname: "/grievanceMonitoring/dashboard",
                      // })
                      {
                        logedInUser === "departmentUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                          });
                      }
                      {
                        logedInUser === "citizenUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                          });
                      }
                      {
                        logedInUser === "cfcUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                          });
                      }
                    }}
                  >
                    <FormattedLabel id="backToDashboard" />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
