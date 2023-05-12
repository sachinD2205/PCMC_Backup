import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import * as MuiIcons from "@mui/icons-material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Tooltip,
  Modal,
  Button,
  CircularProgress,
  LinearProgress,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
// import HeaderAvatar from "../../containers/Layout/components/HeaderAvatar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
// import * as Icons from "@mui/icons-material";
import { logout } from "../../../../features/userSlice";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../../../../components/grievanceMonitoring/view.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";

const drawerWidth = 340;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  height: "92%",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  height: "92%",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  backgroundColor: "#556CD6",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DashboardHome = (props) => {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const container = window !== undefined ? () => window().document.body : undefined;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const [openItemID, setOpenItemID] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [age, setAge] = useState("");
  const [selectedCard, setSelectedCard] = useState(false);

  // const [response, setResponse] = useState([]);

  const language = useSelector((state) => state.labels.language);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  useEffect(() => {
    // onDepartmentLogin();
  }, []);

  const onDepartmentLogin = () => {
    const body = {
      userName: "ADMIN",
      password: "Admin@123",
      // userName: user,
      // password: pwd,
    };

    axios
      .post("http://localhost:8090/cfc/auth/signin", body)
      .then((r) => {
        if (r.status == 200) {
          console.log("department login response", r);
          setResponse(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
        // toast("Login Failed ! Please Try Again !", {
        //   type: "error",
        // });
      });

    // if (user == "Admin" && pwd == 12345) {
    //   router.push("/DepartmentDashboard");
    // }
  };
  const [openCollapse, setOpenCollapse] = React.useState(false);

  function handleListItemsClick(key) {
    if (openCollapse == false) {
      setOpenItemID(key);
      setOpenCollapse(true);
    } else {
      setOpenItemID(null);
      setOpenCollapse(false);
    }
  }

  const handleDrawerOpen = () => {
    console.log("drawer opem");
    setOpen(true);
  };
  const handleDrawerClose = () => {
    console.log("drawer opem");
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    router.push("/login");
  };

  const handleMenuSubListItemClick = (value, index) => {
    console.log("value", value);
    router.push(value);
  };

  let arr =
    response.menus &&
    response.menus.filter((val) => {
      return val.isParent;
    });

  let check =
    response.menus &&
    response.menus.map((test) => {
      return test.appKey == 5 && test;
    });

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData(159, 6.0, 4.0, "ddD", "sdsd"),
    createData(237, 9.0, 4.3, "HDHD", "sdqw"),
    createData(262, 16.0, 6.0, "DQJD", "fqf"),
    createData(305, 3.7, 4.3, "DQWJH", "qaef"),
    createData(356, 16.0, 3.9, "DQW", "ahf"),
  ];

  // ............................................API CALSS................................

  const [transData, setTransData] = useState([]);
  const [resolvedGrievance, setResolvedGrievance] = useState([]);
  const [unResolvedGrievance, setUnResolvedGrievance] = useState([]);
  const [unVerified, setUnVerified] = useState([]);
  const [VerifiedD, setVerifiedD] = useState([]);
  const [verified, setVerified] = useState();
  const [notVerified, setNotVerified] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [isModalOpenForUnResolved, setIsModalOpenForUnResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router1 = useRouter();

  const user = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.id);
    return state?.user?.user?.id;
  });

  const user1 = useSelector((state) => {
    console.log(":54", state?.user?.user?.firstName);
    let userNamed = language === "en" ? state?.user?.user?.firstName : state?.user?.user?.firstNamemr;

    return userNamed;
  });

  // .............>>>>>>>>>>>>>>><<<<<<<<<<<<<<.................
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });

  // useEffect(() => {
  //   console.log(":54", user1)
  // }, [user1])

  // console.log(":41", state?.user?.user?.userDao?.firstNameEn)

  const getTransactions = async () => {
    try {
      setLoading(true); // Set loading before sending API request
      const response = await axios.get(
        `${urls.GM}/trnRegisterComplaint/getListByUser?id=${user}`,
        {
          headers: {
            UserId: user,
          },
        },
        // `${urls.GM}/trnRegisterComplaint/getListByUser?id=3`
      );

      let result = response?.data?.trnRegisterComplaintList;

      console.log(":1", result);
      let _res = result?.map((val, i) => {
        // let { propertyHoldersDetails } = val
        // console.log("propertyHoldersDetails", propertyHoldersDetails)

        // let _res1 = val?.complaintSubTypeMaster?.map((obj) => {
        //   return obj?.complaintSubType
        // })
        console.log(":lkj", val);
        // ...............................................................................
        // let _res1 = Object.keys(val?.complaintSubTypeMaster).map((key) => {
        //   return { [key]: val?.complaintSubTypeMaster[key] }
        // })

        // let _res2 = Object.keys(val?.complaintTypeMaster).map((key) => {
        //   return { [key]: val?.complaintTypeMaster[key] }
        // })
        // ...............................................................................
        // console.log(":32", _res1)

        // let newObj = {}
        // _res1.map((ob) => {
        //   newObj = {
        //     ...newObj,
        //     ...ob,
        //   }
        // })
        // console.log("newObj", newObj)

        // ...............................................................................
        // let arr = _res1?.find((obj) => obj.complaintSubType)
        // let arr1 = _res2?.find((obj) => obj.complaintType)
        // ...............................................................................
        return {
          // ...val,
          // ...arr,
          // ...arr1,
          // fullNameEng: propertyHoldersDetails[0]?.fullNameEng
          //   ? propertyHoldersDetails[0].fullNameEng
          //   : " - ",
          id: val.id,
          srNo: i + 1,
          firstName: val.firstName,
          complaintType: val.complaintType,
          citizenName: val.citizenName,
          city: val.city,
          complaintDescription: val.complaintDescription,
          complaintSubType: val.complaintSubType,
          deptName: val.deptName,
          email: val.email,
          mobileNumber: val.mobileNumber,
          subDepartment: val.subDepartment,
          subDepartmentText: val.subDepartmentText,
          complaintStatus: val.complaintStatus,
          grievanceDate: moment(val.grievanceDate).format("DD-MM-YYYY"),
          escDate: moment(val.escDate).format("DD-MM-YYYY"),
          complaintSubType: val.complaintSubType,
          complaintType: val.complaintType,
          complaintStatusText: val.complaintStatusText,
          subject: val.subject,
          applicationNo: val.applicationNo,
        };
      });

      // let _res1 = result?.map((val, i) => {
      //   // let { propertyHoldersDetails } = val
      //   // console.log("propertyHoldersDetails", propertyHoldersDetails)
      //   let _res2 = val.map((obj) => {
      //     return {
      //       ..._res,
      //       id: obj.id,
      //       srNo: i + 1,
      //       // fullNameEng: propertyHoldersDetails[0]?.fullNameEng
      //       //   ? propertyHoldersDetails[0].fullNameEng
      //       //   : " - ",
      //       // firstName: obj.firstName,
      //       // complaintType: obj.complaintType,
      //       // citizenName: obj.citizenName,
      //       // city: obj.city,
      //       // complaintDescription: obj.complaintDescription,
      //       // complaintSubType: obj.complaintSubType,
      //       // deptName: obj.deptName,
      //       // email: obj.email,
      //       // mobileNumber: obj.mobileNumber,
      //     }
      //   })
      //   // return {
      //   //   ..._res,
      //   //   id: val.id,
      //   //   srNo: i + 1,
      //   // }
      //   // return _res2
      // })
      console.log(":56", _res);
      let UnresolvedComplaints = result?.filter((obj) => obj.complaintStatusText === "Open");
      let resolvedComplaints = result?.filter((obj) => obj.complaintStatusText === "Close");
      setTransData(_res);
      setResolvedGrievance(resolvedComplaints);
      setUnResolvedGrievance(UnresolvedComplaints);
      ///////////////////////////LENGTH/////////
      setUnVerified(UnresolvedComplaints);
      setVerifiedD(resolvedComplaints);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("errorKyaMila", error);
      setLoading(false); // Stop loading in case of error
    }
  };
  // console.log("TransDataKyaMila", transData);
  //................................filter functions..........................
  // const verifiedDoc = () => {
  //   return transData?.filter((obj) => obj.verified === "Y")
  // }

  // const unVerifiedDoc = () => {
  //   if (transData.length > 0) {
  //     alert("aaya")
  //     transData?.filter((obj) => obj?.verified === "N")
  //   }
  // }
  // console.log("3025", unVerifiedDoc())

  useEffect(() => {
    getTransactions();
  }, [user]);

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true);
    // alert("true")
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenForResolved(false);
    setIsModalOpenForUnResolved(false);
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      minWidth: 260,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
      minWidth: 164,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "deptName",
      headerName: <FormattedLabel id="departmentName" />,
      minWidth: 160,
      maxWidth: 300,
      headerAlign: "center",
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      minWidth: 300,
      maxWidth: 350,
      headerAlign: "center",
    },
    {
      field: "complaintType",
      headerName: <FormattedLabel id="grievanceType" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "escDate",
      headerName: language === "en" ? "Tentative Resolution Date" : "तात्पुरत्या ठरावाची तारीख",
      minWidth: 240,
      // maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "complaintStatusText",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: 164,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ? (
              <div style={{ color: "orange" }}>{params?.row?.complaintStatusText}</div>
            ) : (
              <div style={{ color: "green" }}>{params?.row?.complaintStatusText}</div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 60,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname: "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                  query: { id: params.row.applicationNo },
                });
                console.log("params.row: ", params?.row?.id);
              }}
            >
              {language === "en" ? (
                <Tooltip title={`VIEW GRIEVANCE AGAINST THIS ID ${params?.row?.id}`}>
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title={`${params?.row?.id} या आयडी विरुद्ध तक्रार पहा `}>
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <Box
          sx={{
            width: "87vw",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // margin: "auto",
            // textAlign: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box>
            <Box
              sx={{
                display: "flex",
                padding: "30px",

                flexDirection: "column",
              }}
            >
              <Typography>
                <p className={styles.fancy_link}>
                  {language === "en" ? (
                    <>
                      <FormattedLabel id="welcomeToTheDashboard" /> <strong>{user1}</strong>{" "}
                    </>
                  ) : (
                    <>
                      <FormattedLabel id="welcomeToTheDashboard" /> <strong>{user1}</strong>{" "}
                    </>
                  )}
                </p>
              </Typography>
              {/* .......................CARDS............................ */}
              <Grid container style={{ display: "flex", justifyContent: "center" }}>
                {[
                  // {
                  //   icon: "Menu",
                  //   count: `${transData.length}`,
                  //   name: "Total Complaints Filed",
                  //   bg: "#FFA500",
                  // },
                  {
                    icon: "Menu",
                    count: `${VerifiedD?.length ? VerifiedD.length : 0}`,
                    name: "Resolved Grievances",
                    nameMr: "तक्रारींचे निराकरण केले",
                    bg: "#00FF00",
                  },
                  {
                    icon: "Menu",
                    count: `${unVerified?.length ? unVerified.length : 0}`,
                    name: "Unresolved Grievances",
                    nameMr: "न सुटलेल्या तक्रारी",
                    // bg: "#00FF00",
                    bg: "red",
                  },
                  {
                    icon: "Menu",
                    count:
                      VerifiedD?.length || unVerified?.length ? unVerified?.length + VerifiedD?.length : 0,
                    // name: "Total Grievances",
                    name: "Total Grievances",
                    nameMr: "एकूण तक्रारी",
                    bg: "#FFC0CB",
                  },
                ].map((val, id) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Tooltip title={val.name}>
                      <Grid
                        key={id}
                        item
                        xs={3}
                        style={{
                          paddingTop: "10px",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          paddingBottom: "0px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "15px",
                            backgroundColor: "white",
                            height: "100%",
                          }}
                          sx={{
                            ":hover": {
                              boxShadow: "0px 5px #556CD6",
                            },
                          }}
                          boxShadow={3}
                        >
                          <Grid
                            item
                            xs={2}
                            style={{
                              padding: "5px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: val.bg,
                              color: "white",
                              borderRadius: "7px",
                            }}
                            boxShadow={2}
                          >
                            <ComponentWithIcon iconName={val.icon} />
                          </Grid>
                          <Grid
                            item
                            xs={10}
                            style={{
                              padding: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              style={{
                                fontWeight: "500",
                                fontSize: "25px",
                                color: "#556CD6",
                              }}
                            >
                              {val.count}
                            </Typography>
                            {language == "en"
                              ? val.name === "Resolved Grievances" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setIsModalOpenForResolved(true);
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                )
                              : val.nameMr == "तक्रारींचे निराकरण केले" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setIsModalOpenForResolved(true);
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.nameMr}
                                  </Link>
                                )}
                            {language == "en"
                              ? val.name === "Unresolved Grievances" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setIsModalOpenForUnResolved(true);
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                )
                              : val.nameMr === "न सुटलेल्या तक्रारी" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setIsModalOpenForUnResolved(true);
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.nameMr}
                                  </Link>
                                )}

                            {language == "en"
                              ? val.name === "Total Grievances" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    // onClick={() => {
                                    //   setSelectedCard(true);
                                    //   setIsModalOpenForUnResolved(true);
                                    // }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                )
                              : val.nameMr === "एकूण तक्रारी" && (
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    // onClick={() => {
                                    //   setSelectedCard(true);
                                    //   setIsModalOpenForUnResolved(true);
                                    // }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.nameMr}
                                  </Link>
                                )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Tooltip>
                  );
                })}
              </Grid>
            </Box>
          </Box>

          <Box
            component={Paper}
            style={{
              // height: "100vh",
              width: "100%",
            }}
          >
            {/* <Typography style={{ display: "flex", justifyContent: "center" }}>
              <h4>Here is your All Grievances</h4>{" "}
            </Typography> */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1%",
              }}
            >
              <Box
                className={styles.details1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "99%",
                  height: "auto",
                  overflow: "auto",
                  padding: "0.4%",
                  color: "black",
                  fontSize: 18,
                  fontWeight: 500,
                  // borderRadius: 100,
                }}
              >
                <strong className={styles.fancy_link1}>
                  <FormattedLabel id="myGrievance" />
                </strong>
              </Box>
            </Box>

            <Grid
              container
              style={{ padding: "10px" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={10}></Grid>
              <Grid
                item
                xs={2}
                style={{
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "baseline",
                  textAlign: "center",
                  // paddingTop: "2px",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={
                    <AddIcon
                      style={
                        {
                          // display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                          // textAlign: "center",
                          // paddingTop: "2px",
                        }
                      }
                    />
                  }
                  type="primary"
                  // disabled={buttonInputState}
                  onClick={() =>
                    router.push({
                      pathname: "/grievanceMonitoring/transactions/RegisterComplaint",
                    })
                  }
                  size="small"
                  style={{
                    textAlign: "center",
                  }}
                >
                  {<FormattedLabel id="raiseGrievance" />}
                </Button>
              </Grid>
            </Grid>

            {/* <Box style={{ height: "87vh", margin: "10px" }}> */}
            <DataGrid
              autoHeight
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              // disableColumnFilter
              // disableColumnSelector
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 0 },
                  disableExport: true,
                  disableToolbarButton: false,
                  csvOptions: { disableToolbarButton: false },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="standard"
              rows={transData || []}
              pageSize={10}
              rowsPerPageOptions={[10]}
              columns={columns}
              disableSelectionOnClick
            />
            {/* </Box> */}
          </Box>

          {/* /////////////////////////////MODALS/////////////////////////////// */}
          <Modal
            title="Modal For Resolved Grievance"
            open={isModalOpenForResolved}
            onOk={true}
            // onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
            footer=""
            // width="1800px"
            // height="auto"
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                backgroundColor: "white",
                height: "70vh",
                // height: "auto",
              }}
            >
              <Grid
                container
                style={{ padding: "10px" }}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={10}></Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    // disabled={buttonInputState}
                    onClick={() =>
                      router.push({
                        pathname: "/grievanceMonitoring/transactions/RegisterComplaint",
                      })
                    }
                  >
                    {<FormattedLabel id="raiseGrievance" />}
                  </Button>
                </Grid>
              </Grid>
              {/* <Box style={{ height: "60vh" }}> */}
              <>
                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {
                      // backgroundColor:'red',
                      // height: '800px !important',
                      // display: "flex",
                      // flexDirection: "column-reverse",
                      // overflow:'auto !important'
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
                  // disableColumnFilter
                  // disableColumnSelector
                  // disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 0 },
                      disableExport: true,
                      disableToolbarButton: false,
                      csvOptions: { disableToolbarButton: false },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  density="standard"
                  rows={resolvedGrievance || []}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  columns={columns}
                  disableSelectionOnClick
                />
              </>
              {/* </Box> */}
              <div
                style={{
                  marginTop: "20vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  {<FormattedLabel id="closeModal" />}
                </Button>
              </div>
            </Box>
          </Modal>

          {/* /////////////////////////////MODALS/////////////////////////////// */}
          <Modal
            title="Modal For UnResolved Grievance"
            open={isModalOpenForUnResolved}
            onOk={true}
            // onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
            footer=""
            // width="1800px"
            // height="auto"
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                // height: 400,
                width: "90%",
                backgroundColor: "white",
                height: "70vh",
              }}
            >
              <Grid
                container
                style={{ padding: "10px" }}
                // direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={10}></Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    // disabled={buttonInputState}
                    onClick={() =>
                      router.push({
                        pathname: "/grievanceMonitoring/transactions/RegisterComplaint",
                      })
                    }
                  >
                    {<FormattedLabel id="raiseGrievance" />}
                  </Button>
                </Grid>
              </Grid>
              {/* <Box style={{ height: "60vh" }}> */}
              <>
                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {
                      // backgroundColor:'red',
                      // height: '800px !important',
                      // display: "flex",
                      // flexDirection: "column-reverse",
                      // overflow:'auto !important'
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
                  // disableColumnFilter
                  // disableColumnSelector
                  // disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 0 },
                      disableExport: true,
                      disableToolbarButton: false,
                      csvOptions: { disableToolbarButton: false },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  density="standard"
                  rows={unResolvedGrievance || []}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  columns={columns}
                  disableSelectionOnClick
                />
              </>
              {/* </Box> */}
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  {<FormattedLabel id="closeModal" />}
                </Button>
              </div>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

DashboardHome.propTypes = {
  window: PropTypes.func,
};

export default DashboardHome;
