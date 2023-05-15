import { Button, Grid, Paper, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";

const index = () => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});

  const language = useSelector((state) => state.labels.language);

      //get logged in user
      const user = useSelector((state) => state.user.user);

      let loggedInUser = localStorage.getItem("loggedInUser");
      console.log("loggedInUser", loggedInUser);
    
      // selected menu from drawer
    
      let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
    
      // get authority of selected user
    
      const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
      })?.roles;
    
      console.log("dataSource", dataSource);

  useEffect(() => {
    getPhotopassDataById(router.query.id);
  }, [router.query.id]);

  useEffect(() => {
    let res = dataSource?.trnVisitScheduleList?.length > 0 ? dataSource?.trnVisitScheduleList[dataSource?.trnVisitScheduleList.length-1] : null;
    setValue("scheduledTime", res? res?.scheduledDate : "-")
      setValue("rescheduleTime", res? res?.rescheduleDate : "-")

  }, [dataSource]);

  const getPhotopassDataById = (id) => {
    if(id){
    if (loggedInUser === "citizenUser") {
        axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: {
            UserId: user.id
          },
        })
        .then((r) => {
          let result = r.data;
          //   console.log("getPhotopassDataById", result);
          setDataSource(result);
        });
      } else {
        axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          let result = r.data;
          //   console.log("getPhotopassDataById", result);
          setDataSource(result);
        });
      }
    }
  };

  const handleOnSubmit = (formData) => {
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/issuePhotopass/save`, _body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", `Site visit against ${dataSource.applicationNo} scheduled successfully !`, "success");
          router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
        }
      });
  };

  return (
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
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box
          style={{
            marginTop: "10px",
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
            <FormattedLabel id="scheduleSiteVisit" />
          </h2>
        </Box>

        <Grid container sx={{ padding: "10px" }}>
          {/* Schedule date & time */}

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
              marginTop:"10px"
            }}
          >
            <Controller
              control={control}
              name="scheduledTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        fullWidth
                        sx={{ width: "75%" }}
                        error={errors.scheduledTime}
                        helperText={errors?.scheduledTime ? errors.scheduledTime.message : null}
                      />
                    )}
                    label={<FormattedLabel id="scheduleDateTime" required />}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                    defaultValue={null}
                    inputFormat="DD-MM-YYYY hh:mm:ss"
                  />
                </LocalizationProvider>
              )}
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
              marginTop:"10px"
            }}
          >
            <Controller
              control={control}
              name="rescheduleTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        fullWidth
                        sx={{ width: "75%" }}
                        error={errors.scheduledTime}
                        helperText={errors?.scheduledTime ? errors.scheduledTime.message : null}
                      />
                    )}
                    label={<FormattedLabel id="rescheduleDateTime" required />}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                    defaultValue={null}
                    inputFormat="DD-MM-YYYY hh:mm:ss"
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

        </Grid>

        <Grid container sx={{ padding: "10px" }}>

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
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToApp />}
              onClick={() => {
                router.push(
                  `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`,
                );
              }}
            >
              <FormattedLabel id="exit" />
              {/* {labels["exit"]} */}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default index;
