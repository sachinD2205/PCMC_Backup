import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import urls from "../../../URLS/urls";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import KeyIcon from "@mui/icons-material/Key";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// Main Component - Clerk
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    //resolver: yupResolver(schema),
    mode: "onChange",
  });

  // let user = useSelector((state) => state.user.user)
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  const [dashboardData, setDashboardData] = useState();

  useEffect(() => {
    getDashboardDetails();
  }, []);

  const getDashboardDetails = async () => {
    const departmentResponse = await axios.get(
      `${urls.SMURL}/trnVisitorEntryPass/getDashboardDetails`,
      // , {
      //   params: {
      //     zoneKey: 1,
      //   },
      // }
    );
    console.log("34rt", departmentResponse?.data?.Values);
    setDashboardData(departmentResponse?.data?.Values);
  };

  // Approved Application
  const clerkTabClick = (props) => {};

  return (
    <div>
      <Paper component={Box} squar="true" p={1} elevation={5}>
        <Grid container>
          <Grid item xs={12}>
            <Paper component={Box} p={2} m={2} squar="true" elevation={5}>
              <Typography variant="h6">
                <strong>{language === "en" ? "WELCOME" : "स्वागत आहे"}</strong>
              </Typography>

              {/* <br /> */}
              <Typography variant="subtitle1" style={{ justifyContent: "center" }}>
                <strong>
                  {language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
                  {language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
                  {language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
                </strong>
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper component={Box} p={2} m={2} elevation={5}>
          <Grid container>
            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <DirectionsWalkIcon color="secondary" sx={{ color: "blue" }} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="visitorIn" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassIn ? dashboardData?.trnVisitorEntryPassIn : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <LogoutIcon sx={{ color: "blue" }} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="visitorOut" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassOut ? dashboardData?.trnVisitorEntryPassOut : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <DirectionsCarIcon color="secondary" />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="vehicleIn" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleIn ? dashboardData?.trnVehicleIn : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <DirectionsCarIcon color="secondary" sx={{ color: "blue" }} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="vehicleOut" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleOut ? dashboardData?.trnVehicleOut : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <KeyIcon color="warning" />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="deptKeyIssued" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnDepartmentKeyIn ? dashboardData?.trnDepartmentKeyIn : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <KeyIcon color="warning" />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="deptKeyReceived" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnDepartmentKeyOut ? dashboardData?.trnDepartmentKeyOut : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={1.71} xl={1}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Brightness4Icon color="error" />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <strong align="center">
                    <FormattedLabel id="nightDeptCheckupEntry" />
                  </strong>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnNightDepartmentCheckUpEntryIn
                      ? dashboardData?.trnNightDepartmentCheckUpEntryIn
                      : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {/* <Grid container sx={{ border: "solid red" }}>
         
          <Grid item xs={12}>
            <Paper
              sx={{ height: "160px" }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            >
              <div className={styles.test}>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsWalkIcon color="secondary" sx={{ color: "blue" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="visitorIn" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassIn ? dashboardData?.trnVisitorEntryPassIn : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <LogoutIcon sx={{ color: "blue" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="visitorOut" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassOut ? dashboardData?.trnVisitorEntryPassOut : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsCarIcon color="secondary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="vehicleIn" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleIn ? dashboardData?.trnVehicleIn : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsCarIcon color="secondary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="vehicleOut" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleOut ? dashboardData?.trnVehicleOut : "-"}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("APPROVED")}>
                  <div className={styles.icono}>
                    <KeyIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="deptKeyIssued" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="green">
                    {dashboardData?.trnDepartmentKeyIn ? dashboardData?.trnDepartmentKeyIn : "-"}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("PENDING")}>
                  <div className={styles.icono}>
                    <KeyIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="deptKeyReceived" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="orange">
                    {dashboardData?.trnDepartmentKeyOut}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("REJECTED")}>
                  <div className={styles.icono}>
                    <Brightness4Icon color="error" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="nightDeptCheckupEntry" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="error">
                    {dashboardData?.trnNightDepartmentCheckUpEntryIn}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid> */}
      </Paper>
    </div>
  );
};

export default Index;
