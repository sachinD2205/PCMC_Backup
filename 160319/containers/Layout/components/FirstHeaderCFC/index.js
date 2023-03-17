import { AppBar, Box, Grid, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import styles from "./[FirstHeaderCFC].module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../features/userSlice";

const drawerWidth = 340;

const FirstHeaderCFC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  // const user = useSelector((state) => state.user.user)
  // const _language = useSelector((state) => state.labels.language);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state.user.user.userDao);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    localStorage.setItem("loggedInUser", null);
    router.push("/login");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container>
          <Grid item xs={1} className={styles.appIcon}>
            <Image src="/logo.png" alt="Picturer" width={50} height={50} style={{ cursor: "pointer" }} />
          </Grid>
          <Grid item xs={8} className={styles.appNameContainer}>
            <Typography className={styles.title1}>Pimpri Chinchwad</Typography>
            <Typography className={styles.title1}>Municipal Corporation</Typography>
          </Grid>
          <Grid item xs={1}>
            <Link>Marathi</Link>
            <Link>English</Link>
          </Grid>
          <Grid item xs={2}>
            <div className={styles.menuIcon}>
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
              {/* <Menu
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
                <MenuItem className={styles.menuList}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" className={styles.menuTitle}>
                      Name :{" "}
                    </Typography>
                    <Typography>ABCD MNOP</Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Role :{" "}
                    </Typography>
                    <Typography>Admin</Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Email ID :{" "}
                    </Typography>
                    <Typography>abcdmnop@gmail.component</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
                  Logout
                </MenuItem>
              </Menu> */}
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
                <MenuItem className={styles.menuList}>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" className={styles.menuTitle}>
                      Name :{" "}
                    </Typography>
                    <Typography>
                      {_language === "en" ? user?.userDao?.firstNameEn : user?.userDao?.firstNameMr}{" "}
                      {_language === "en" ? user?.userDao?.middleNameEn : user?.userDao?.middleNameMr}{" "}
                      {_language === "en" ? user?.userDao?.lastNameEn : user?.userDao?.lastNameMr}
                    </Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Role :{" "}
                    </Typography>
                    <Typography>Admin</Typography>
                  </Box>
                  <Box className={styles.menuTitleContainer}>
                    <Typography variant="body2" className={styles.menuTitle}>
                      Email ID :{" "}
                    </Typography>
                    <Typography>{user?.userDao?.email}</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout} style={{ color: "#2162DF" }}>
                  {_language === "en" ? "Logout" : "बाहेर पडा"}
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default FirstHeaderCFC;
