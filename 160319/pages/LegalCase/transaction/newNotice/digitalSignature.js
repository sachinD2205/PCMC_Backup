import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DigitalSignature = () => {
  const router = useRouter();

  const selectedNotice = useSelector((state) => {
    console.log("111selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  let prNotice = selectedNotice.parawiseTrnParawiseReportDaoLst?.map((val) => {
    return {
      id: val.id,
      issueNo: val?.issueNo,
      paragraphWiseAanswerDraftOfIssues: val.paragraphWiseAanswerDraftOfIssues,
      parawiseReportId: val?.parawiseReportId,
    };
  });

  console.log("PRNotice", prNotice);

  let filtered = prNotice?.map((val) => {
    if (val.parawiseReportId !== null) {
      console.log("valllll", val);
      return {
        ...val,
        paragraphWiseAanswerDraftOfIssuesRTN:
          selectedNotice.parawiseTrnParawiseReportDaoLst.find(
            (rtn) => rtn.parawiseReportId === val.id
          )?.paragraphWiseAanswerDraftOfIssues,
      };
    }
  });

  console.log("filtered",filtered);

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
          <Typography>Notice Reply Draft.</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</Typography>
          <Typography>PIMPRI- 411018.</Typography>
          <Typography>{router.query.departmentName}</Typography>
          {/* <Typography>जा.क्र.</Typography> */}
          <Typography>Date - {router.query.noticeDate}</Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={4}>
          <Typography>To,</Typography>
          <Typography>
            {selectedNotice.noticeRecivedFromAdvocatePerson}
          </Typography>
          <Typography>{selectedNotice.advocateAddress}</Typography>
          {/* <Typography>प्लॉट नं.१०६, श्रुती एन्क्लेव्ह,</Typography>
          <Typography>टेल्को नेहरुनगर रोड, आर आर हॉटेल समोर</Typography>
          <Typography>उद्यमनगर, पिंपरी, पुणे- ४११०१८.</Typography> */}
        </Grid>
      </Grid>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={12}>
          {filtered?.map((val, index) => {
            console.log("888",val);
            return (
              <Grid container key={index}>
                <Grid item xs={11.5}>
                  <Typography>
                    {val?.paragraphWiseAanswerDraftOfIssues}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
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
