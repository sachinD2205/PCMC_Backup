import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Grid, Paper, Typography } from "@mui/material";
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
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ClearIcon from "@mui/icons-material/Clear";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
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

  const authority = user?.menus?.find((r) => r.clickTo === selectedMenuFromDrawer)?.roles;

  console.log("authority", authority);

  const [modalforAprov, setmodalforAprov] = useState(false);
  const [modalforRejt, setmodalforRejt] = useState(false);

  const [shrink1, setShrink1] = useState();
  const [shrink2, setShrink2] = useState();
  const [addressShrink, setAddressShrink] = useState();
  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();
  const dispach = useDispatch();
  // Record Count State
  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);

  const [dashboardData, setDashboardData] = useState();

  // Pay Button
  const payBtn = () => {
    toast.success("Paid Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // zones

  // getZoneKeys
  const getZoneKeys = () => {
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        })),
      );
    });
  };

  // wardKeys

  // getWardKeys
  const getWardKeys = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardKey: row.wardName,
        })),
      );
    });
  };

  useEffect(() => {
    getWardKeys();
    getZoneKeys();
    getDashboardDetails();
  }, []);

  const getDashboardDetails = async () => {
    const departmentResponse = await axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getDashboardDetails`);
    console.log("departmentResponse",departmentResponse);
    setDashboardData(departmentResponse?.data?.Values);
  };

  // Approved Application
  const clerkTabClick = (props) => {};

  return (
    <div>
      <Paper component={Box} squar="true" elevation={5}>
        <Grid container>
          {/** Clerk */}
          <Grid item xs={12}>
            <Paper
              component={Box}
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              squar="true"
              elevation={5}
              p={2}
            >
              <Typography variant="h6" style={{ justifyContent: "center" }}>
                <strong>PUBLIC AUDITORIUM BOOKING AND BROADCAST MANAGEMENT</strong>
                {/* <strong>
                  <FormattedLabel id="publicAud" />
                </strong> */}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container>
          {/** Clerk */}
          <Grid item xs={12}>
            <Paper component={Box} p={2} m={2} squar="true" elevation={5}>
              <Typography variant="h5">
                <strong>{language === "en" ? "WELCOME" : "स्वागत आहे"}</strong>
              </Typography>

              {/* <br /> */}
              <Typography variant="h6" style={{ justifyContent: "center" }}>
                <strong>
                  {language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
                  {language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
                  {language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
                </strong>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container>
          {/** Applicatins Tabs */}
          <Grid item xs={12}>
            <Paper component={Box} squar="true" elevation={5}>
              {/* <Grid container sx={{ padding: "15px" }}>
                <Grid
                  item
                  xs={4}
                  className={styles.one}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <HomeWorkIcon color="secondary" sx={{ color: "blue" }} />
                  <strong align="center">Auditorium Booked</strong>
                  <Typography variant="h6" align="center" color="secondary">
                    1
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className={styles.one}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <ClearIcon sx={{ color: "red" }} />
                  <strong align="center">Auditorium Booking Cancelled</strong>
                  <Typography variant="h6" align="center" color="secondary">
                    1
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className={styles.one}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <CurrencyRupeeIcon sx={{ color: "red" }} />
                  <strong align="center">Deposit Refunded</strong>
                  <Typography variant="h6" align="center" color="secondary">
                    1
                  </Typography>
                </Grid>
              </Grid> */}
              <div className={styles.test}>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <HomeWorkIcon color="secondary" sx={{ color: "blue" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Auditorium Booked</strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.AuditoriumBookingCount}
                  </Typography>
                </div>
                {/** Vertical Line */}
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <ClearIcon sx={{ color: "red" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Auditorium Booking Cancelled</strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.AuditoriumCancellationCount}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <CurrencyRupeeIcon color="secondary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Deposit Refunded</strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.RefundCount}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Index;