import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class ClassTimetableReportToPrint extends React.Component {
  render() {
    console.log("this.props.data", this.props.data);
    const renderedData = this.props.data.map((r) => {
      return {
        id: r.id,
        time: `${r.fromTime} To ${r.toTime}`,
        subjectName: r.subjectName,
        weekDayKey: r.weekDayKey,
        schoolName: r.schoolName,
        className: r.className,
        divisionName: r.divisionName,
      };
    });
    console.log("renderedData", renderedData);
    let dayArr = ["mon", "tue", "wed", "thu", "fri", "sat"];
    let dayKey = [2, 3, 4, 5, 6, 7];

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
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  component="div"
                  style={{ justifyContent: "center", alignItems: "center", marginBottom: "10px" }}
                >
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
                    <img src="/logo.png" alt="" height="100vh" width="100vw" />
                  </Box>
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
                    पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८.
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
                    शाळेचे वेळापत्रक
                  </Box>
                  <Divider />
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />

            <Grid container sx={{ padding: "6px" }} style={{ textAlign: "center" }}>
              <Grid item xs={4}>
                {" "}
                <Typography>
                  शाळेचे नाव : {renderedData[0].schoolName ? renderedData[0].schoolName : "---"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  वर्गाचे नाव : {renderedData[0].className ? renderedData[0].className : "---"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <Typography>
                  विभागणी: {renderedData[0].divisionName ? renderedData[0].divisionName : "---"}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />
            <div style={{ height: "60vh", width: "100vw" }}>
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
                  <th style={border}>अनु. क्र.</th>
                  <th style={border}>वेळ</th>
                  {dayArr.map((day) => {
                    return (
                      <th key={day} style={border}>
                        {day}
                      </th>
                    );
                  })}
                </tr>
                {renderedData.map((obj, j) => {
                  return (
                    <tr key={obj.id}>
                      <td style={border}>{j + 1}</td>
                      <td style={border}>{obj.time}</td>
                      {dayKey.map((day) => {
                        return (
                          <td key={day} style={border}>
                            {day == obj.weekDayKey ? obj.subjectName : "-"}
                          </td>
                        );
                      })}
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
