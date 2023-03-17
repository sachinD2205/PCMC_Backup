import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DigitalSignature = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  return (
    <Paper>
      <Box
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            cursor: "pointer",
            overflow: "hidden",
            fontSize: "10px",
            whiteSpace: "normal",
            backgroundColor: "green",
            color: "white",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#556CD6",
            },
          }}
        >
          Apply Digital Signature
        </Button>
      </Box>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={8}>
          <Typography>Opinion Reply Draft.</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</Typography>
          <Typography>PIMPRI- 411018.</Typography>
          <Typography></Typography>
          {/* <Typography>जा.क्र.</Typography> */}
          <Typography>Date - </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={4}>
          <Typography>To,</Typography>
          {/* <Typography>प्लॉट नं.१०६, श्रुती एन्क्लेव्ह,</Typography>
          <Typography>टेल्को नेहरुनगर रोड, आर आर हॉटेल समोर</Typography>
          <Typography>उद्यमनगर, पिंपरी, पुणे- ४११०१८.</Typography> */}
        </Grid>
      </Grid>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={12}>
         
        </Grid>
      </Grid>
      <Box sx={{ padding: "10px" }}>
        <Box>
          <Typography>Sincerely</Typography>
        </Box>
        <Box>
          <Typography>__________________ (Signature)</Typography>
        </Box>
        <Box>
          <Typography>
            __________________ __________________ __________________ (Name)
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DigitalSignature;
