import React, { useEffect, useState } from "react";
import { Avatar, Popover, Row, Input, Col } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, setApplicationName } from "../../../../features/userSlice";
import { useRouter } from "next/router";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./[HeaderAvatar].module.css";
import { language } from "../../../../features/labelSlice";

const HeaderAvatar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const underline = useSelector((state) => state?.labels.language);
  const [runAgain, setRunAgain] = useState(false);
  const user = useSelector((state) => {
    console.log("user", state.user);
    return state.user.user;
  });

  // @ts-ignore
  const userDetailsInRedux = useSelector((state) => {
    console.log("state.user", state.user);
    return state.user;
  });
  // const userDetailsInRedux = useSelector((state) => state.user.user)
  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    router.push("/login");
  };

  const usersCitizenDashboardData = useSelector((state) => {
    return state.user.usersCitizenDashboardData;
  });

  let [services, setServices] = useState(getServicesByAppId(77));

  function getServicesByAppId(appId) {
    return usersCitizenDashboardData?.services?.
      find((v) => v?.id === appId)
      // .map((r) => r);
  }



  useEffect(() => {
    console.log("432services",services);
  }, [services])
  


  const content = (
    <>
      <p>
        <b>Name:</b>
        <br />
        {userDetailsInRedux?.fullName}
      </p>
      <p>
        <b>Role:</b>
        <br />
        {userDetailsInRedux?.designation}
      </p>
      <p>
        <b>E-Mail:</b>
        <br />
        {userDetailsInRedux?.email}
      </p>
      <a type="link" onClick={handleLogout}>
        <b>Logout</b>
      </a>
    </>
  );

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedValue, setSelectedValue] = useState(10);

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "35%",
            justifyContent: "space-around",
          }}
        >
          <div
            className={
              underline == "en" ? styles.chotuContainer : styles.language
            }
          >
            <span
              className={styles.engLang}
              style={{
                color: "white",
                fontSize: "15px",
              }}
              onClick={() => {
                setRunAgain(true);
                dispatch(language("en"));
              }}
            >
              English
            </span>
          </div>
          <div
            className={
              underline == "mr" ? styles.chotuContainer : styles.language
            }
          >
            <span
              className={styles.language}
              style={{
                color: "white",
                fontSize: "15px",
              }}
              onClick={() => {
                setRunAgain(true);
                dispatch(language("mr"));
              }}
            >
              Marathi
            </span>
          </div>
        </div>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem style={{ display: "flex", flexDirection: "column" }}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography variant="body2" style={{ fontWeight: "600" }}>
                Name :{" "}
              </Typography>
              <Typography>
                {console.log(
                  "43",
                  underline === "en" ? user?.firstName : user?.firstNameMr
                )}
                {underline === "en" ? user?.firstName : user?.firstNameMr}{" "}
                {underline === "en" ? user?.middleName : user?.middleNameMr}{" "}
                {underline === "en" ? user?.surname : user?.surnamemr}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography variant="body2" style={{ fontWeight: "600" }}>
                Email ID :{" "}
              </Typography>
              <Typography>{user?.emailID}</Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              // console.log("prevRoute",router);
              // dispatch(setApplicationName(services))
              router.push("/CompleteProfile");
            }}
            style={{ color: "#2162DF" }}
          >
            Complete Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default HeaderAvatar;
