import React, { useState, useEffect } from "react"
import { styled, useTheme } from "@mui/material/styles"
import * as MuiIcons from "@mui/icons-material"
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from "@mui/material/AppBar"
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
} from "@mui/material"
import PropTypes from "prop-types"
// import HeaderAvatar from "../../containers/Layout/components/HeaderAvatar";
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
// import * as Icons from "@mui/icons-material";
import { logout } from "../../../features/userSlice"
import axios from "axios"
import urls from "../../../URLS/urls"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
// import Link from "next/link";

const drawerWidth = 340

function TabPanel(props) {
  const { children, value, index, ...other } = props

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
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
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
})

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
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  backgroundColor: "#556CD6",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

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
}))

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
}))

const DashboardHome = (props) => {
  const { window, children } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const container =
    window !== undefined ? () => window().document.body : undefined

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const [openItemID, setOpenItemID] = useState(null)
  const dispatch = useDispatch()
  const theme = useTheme()

  const [age, setAge] = useState("")
  const [selectedCard, setSelectedCard] = useState(false)

  // const [response, setResponse] = useState([]);

  const handleChange = (event) => {
    setAge(event.target.value)
  }

  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData
  })

  useEffect(() => {
    // onDepartmentLogin();
  }, [])

  const onDepartmentLogin = () => {
    const body = {
      userName: "ADMIN",
      password: "Admin@123",
      // userName: user,
      // password: pwd,
    }

    axios
      .post("http://localhost:8090/cfc/auth/signin", body)
      .then((r) => {
        if (r.status == 200) {
          console.log("department login response", r)
          setResponse(r.data)
        }
      })
      .catch((err) => {
        console.log("err", err)
        // toast("Login Failed ! Please Try Again !", {
        //   type: "error",
        // });
      })

    // if (user == "Admin" && pwd == 12345) {
    //   router.push("/DepartmentDashboard");
    // }
  }
  const [openCollapse, setOpenCollapse] = React.useState(false)

  function handleListItemsClick(key) {
    if (openCollapse == false) {
      setOpenItemID(key)
      setOpenCollapse(true)
    } else {
      setOpenItemID(null)
      setOpenCollapse(false)
    }
  }

  const handleDrawerOpen = () => {
    console.log("drawer opem")
    setOpen(true)
  }
  const handleDrawerClose = () => {
    console.log("drawer opem")
    setOpen(false)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    dispatch(logout())
    router.push("/login")
  }

  const handleMenuSubListItemClick = (value, index) => {
    console.log("value", value)
    router.push(value)
  }

  let arr =
    response.menus &&
    response.menus.filter((val) => {
      return val.isParent
    })

  let check =
    response.menus &&
    response.menus.map((test) => {
      return test.appKey == 5 && test
    })

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName]
    return <Icon style={{ fontSize: "30px" }} />
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
  }

  const rows = [
    createData(159, 6.0, 4.0, "ddD", "sdsd"),
    createData(237, 9.0, 4.3, "HDHD", "sdqw"),
    createData(262, 16.0, 6.0, "DQJD", "fqf"),
    createData(305, 3.7, 4.3, "DQWJH", "qaef"),
    createData(356, 16.0, 3.9, "DQW", "ahf"),
  ]

  // ............................................API CALSS................................

  const [transData, setTransData] = useState([])
  const [unVerified, setUnVerified] = useState([])
  const [VerifiedD, setVerifiedD] = useState([])
  const [verified, setVerified] = useState()
  const [notVerified, setNotVerified] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getTransactions = async () => {
    try {
      const response = await axios.get(
        `${urls.PTAXURL}/transaction/property/getAll`
      )
      let result = response.data
      let _res = result?.map((val, i) => {
        let { propertyHoldersDetails } = val
        console.log("propertyHoldersDetails", propertyHoldersDetails)

        return {
          ...val,
          id: val.id,
          applicationDate: val.applicationDate,
          applicationNo: val.applicationNo,
          // fullNameEng: propertyHoldersDetails[0]?.fullNameEng
          //   ? propertyHoldersDetails[0].fullNameEng
          //   : " - ",
          fullNameEng: val.propetyNameEng,
          mobile: val.propertyHoldersDetails[0]?.mobile
            ? val.propertyHoldersDetails[0].mobile
            : " - ",
          aadharNo: propertyHoldersDetails[0]?.aadharNo
            ? propertyHoldersDetails[0].aadharNo
            : " - ",
          srNo: i + 1,
        }
      })
      let unVerifiedDoc = result?.filter((obj) => obj.verified === "N")
      let verifiedDoc = result?.filter((obj) => obj.verified === "Y")
      setTransData(_res)
      setUnVerified(unVerifiedDoc)
      setVerifiedD(verifiedDoc)
    } catch (error) {
      console.error("errorKyaMila", error)
    }
  }
  console.log("TransDataKyaMila", transData)
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
    getTransactions()
  }, [])

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true)
    // alert("true")
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: "Application Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationNo",
      headerName: "Application No",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullNameEng",
      headerName: "FUll Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "aadharNo",
    //   headerName: "Aadhar No.",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "mobile",
    //   headerName: "Mobile No.",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ]

  return (
    <>
      {transData.length === 0 ? (
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
                padding: "100px",
                flexDirection: "column",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                  style={{
                    //  width: "60%",
                    backgroundColor: "white",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Select Service
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Select Service"
                    onChange={handleChange}
                  >
                    {check &&
                      check.map((txt, id) => {
                        return (
                          <Box
                            key={id}
                            style={{
                              display: txt.menuNameEng ? "flex" : "none",
                            }}
                          >
                            <MenuItem style={{ width: "100%" }} value={10}>
                              {txt.menuNameEng}
                            </MenuItem>
                          </Box>
                        )
                      })}
                  </Select>
                </FormControl>
              </Box>
              <Grid container>
                {[
                  {
                    icon: "Menu",
                    count: `${transData.length}`,
                    name: "Total Received Applications",
                    bg: "#FFA500",
                  },
                  {
                    icon: "Menu",
                    count: `${VerifiedD.length}`,
                    name: "verified Doc",
                    bg: "#00FF00",
                  },
                  {
                    icon: "Menu",
                    count: `${unVerified.length}`,
                    name: "unverified Doc",
                    bg: "#00FF00",
                  },
                  { icon: "Menu", count: 0, name: "Site Visit", bg: "#FFC0CB" },
                  {
                    icon: "Menu",
                    count: 17,
                    name: "Service Date Entery",
                    bg: "#8F00FF",
                  },
                  {
                    icon: "Menu",
                    count: 9,
                    name: "Approved Proposal",
                    bg: "#FF0000",
                  },
                  {
                    icon: "Menu",
                    count: 2,
                    name: "Forwarded Proposal",
                    bg: "#7B3F00",
                  },
                ].map((val, id) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Tooltip title={val.name}>
                      <Grid key={id} item xs={3} style={{ padding: "10px" }}>
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
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                setSelectedCard(true)
                                setIsModalOpen(true)
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Tooltip>
                  )
                })}
              </Grid>
              <Box>
                {/* {selectedCard && (
              // <Box>
              //   <Box style={{ padding: "10px" }}>
              //     <Typography style={{ fontWeight: "600" }}>
              //       Applications Details -{" "}
              //     </Typography>
              //   </Box>
              //   <TableContainer component={Paper}>
              //     <Table sx={{ minWidth: 650 }} aria-label="simple table">
              //       <TableHead>
              //         <TableRow>
              //           <TableCell>Proposal number</TableCell>
              //           <TableCell align="right">Proposal code</TableCell>
              //           <TableCell align="right">Application number</TableCell>
              //           <TableCell align="right">Service name</TableCell>
              //           <TableCell align="right">Authority name</TableCell>
              //         </TableRow>
              //       </TableHead>
              //       <TableBody>
              //         {rows.map((row) => (
              //           <TableRow
              //             key={row.name}
              //             sx={{
              //               "&:last-child td, &:last-child th": { border: 0 },
              //             }}
              //           >
              //             <TableCell component="th" scope="row">
              //               {row.name}
              //             </TableCell>
              //             <TableCell align="right">{row.calories}</TableCell>
              //             <TableCell align="right">{row.fat}</TableCell>
              //             <TableCell align="right">{row.carbs}</TableCell>
              //             <TableCell align="right">{row.protein}</TableCell>
              //           </TableRow>
              //         ))}
              //       </TableBody>
              //     </Table>
              //   </TableContainer>
              // </Box>

              
            )} */}
              </Box>
            </Box>
          </Box>

          <Modal
            title="Image Modal"
            open={isModalOpen}
            onOk={true}
            onClose={handleCancel}
            footer=""
            // width="1800px"
            // height="auto"
            sx={{
              padding: 5,
            }}
          >
            <div
              style={{
                minWidth: "100%",
                height: "100%",
                textAlign: "center",
              }}
            >
              <DataGrid
                sx={{
                  backgroundColor: "#c297cf",
                  borderRadius: 12,
                  color: "black",
                  fontSize: "18px",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    // backgroundColor: "#36e055",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    disableExport: true,
                    disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                density="standard"
                rows={transData}
                pageSize={10}
                rowsPerPageOptions={[10]}
                columns={columns}
              />

              <Button
                variant="contained"
                style={
                  {
                    // width: "20px",
                  }
                }
                onClick={handleCancel}
              >
                Cancell
              </Button>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

DashboardHome.propTypes = {
  window: PropTypes.func,
}

export default DashboardHome
