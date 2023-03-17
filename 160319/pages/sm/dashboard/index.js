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
    const departmentResponse = await axios.get(`${urls.SMURL}/trnVisitorEntryPass/getDashboardDetails`, {
      params: {
        zoneKey: 1,
      },
    });
    setDashboardData(departmentResponse?.data?.Values);
  };

  // Approved Application
  const clerkTabClick = (props) => {};

  return (
    <div>
      <Paper component={Box} squar="true" elevation={5} m={1} pt={2} pb={2} pr={2} pl={4}>
        <Grid container>
          {/** Clerk */}
          <Grid item xs={12}>
            <Paper component={Box} p={2} m={2} squar="true" elevation={5}>
              <Typography variant="h4">
                <strong>{language === "en" ? "WELCOME" : "स्वागत आहे"}</strong>
              </Typography>

              {/* <br /> */}
              <Typography variant="h5" style={{ justifyContent: "center" }}>
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
            <Paper
              sx={{ height: "160px" }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
              // sx={{ align: "center" }}
            >
              <div className={styles.test}>
                {/** Total Application */}
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
                    {dashboardData?.trnVisitorEntryPassIn}
                  </Typography>
                </div>
                {/** Vertical Line */}
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
                    {dashboardData?.trnVisitorEntryPassOut}
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
                    {dashboardData?.trnVehicleIn}
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
                    {dashboardData?.trnVehicleOut}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Approved Application */}
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
                    {dashboardData?.trnDepartmentKeyIn}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Pending Applications */}
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

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>
                {console.log(
                  "dashboardData?.trnNightDepartmentCheckUpEntryIn",
                  dashboardData?.trnNightDepartmentCheckUpEntryIn,
                )}
                {/** Rejected Application */}
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
        </Grid>
      </Paper>
    </div>
  );
};

export default Index;
