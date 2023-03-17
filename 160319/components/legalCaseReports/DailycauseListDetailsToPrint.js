import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class DailycauseListDetailsToPrint extends React.Component {
  render() {
    console.log("props", this.props.data);
    const renderedData = this.props.data.map((r) => {
      return {
        id: r.id,
        srNo: r.srNo,
        caseNumber: r.caseNumber,
        hearingDate: r.hearingDate,
        filedBy: r.filedBy,
        filedAgainst1: r.filedAgainst1,
        advocateName1: r.advocateName1,
        caseStage: r.srcaseStageNo,
        caseStatus: r.caseStatus,
      };
    });
    console.log("renderedData", renderedData);
    const border = {
      border: "1px solid black",
    };
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div className={styles.small} style={{ margin: "5px" }}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography component="div" style={{ justifyContent: "center", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    शिक्षण मंडळ
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: "regular",
                      m: 1,
                    }}
                  >
                    पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 25,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    Daily Cause List Details
                  </Box>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />
            <div
              style={{
                height: "60vh",
                width: "90vw",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px",
              }}
            >
              <table
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                  width: "100%",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <tr>
                  <th colSpan={8} style={border}>
                    Daily Cause List Details
                  </th>
                </tr>
                <tr>
                  <th style={border}>Sr.No.</th>
                  <th style={border}>Case No</th>
                  <th style={border}>Previous Hearing Date</th>
                  <th style={border}>Case No Filed By</th>
                  <th style={border}>Filed Against</th>
                  <th style={border}>Advocate</th>
                  <th style={border}>Stage</th>
                  <th style={border}>Status</th>
                </tr>
                {renderedData.map((r) => {
                  return (
                    <tr key={r.id}>
                      <td style={border}>{r.srNo}</td>
                      <td style={border}>{r.caseNumber}</td>
                      <td style={border}>{r.hearingDate}</td>
                      <td style={border}>{r.filedBy}</td>
                      <td style={border}>{r.filedAgainst1}</td>
                      <td style={border}>{r.advocateName1}</td>
                      <td style={border}>{r.caseStage}</td>
                      <td style={border}>{r.caseStatus}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
