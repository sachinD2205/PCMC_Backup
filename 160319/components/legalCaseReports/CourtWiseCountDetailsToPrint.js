import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class CourtWiseCountDetailsToPrint extends React.Component {
  render() {
    console.log("props", this.props.data);
    const renderedData = this.props.data.map((r) => {
      return {
        id: r.id,
        courtName: r.courtName,
        finalOrderCount: r.finalOrderCount,
        orderJudgementCount: r.orderJudgementCount,
        runningCount: r.runningCount,
        totalCount: r.totalCount,
        srNo: r.srNo,
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
                    Court Wise Count Details
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
                  <th colSpan={6} style={border}>
                    Court Wise Count Details
                  </th>
                </tr>
                <tr>
                  <th style={border}>Sr.No.</th>
                  <th style={border}>Court Name</th>
                  <th style={border}>Running Cases</th>
                  <th style={border}>For Order /Judgement</th>
                  <th style={border}>Final Order</th>
                  <th style={border}>Total</th>
                </tr>
                {renderedData.map((r) => {
                  return (
                    <tr key={r.id}>
                      <td style={border}>{r.srNo}</td>
                      <td style={border}>{r.courtName}</td>
                      <td style={border}>{r.runningCount}</td>
                      <td style={border}>{r.orderJudgementCount}</td>
                      <td style={border}>{r.finalOrderCount}</td>
                      <td style={border}>{r.totalCount}</td>
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
