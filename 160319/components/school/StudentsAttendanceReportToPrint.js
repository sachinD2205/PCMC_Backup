import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class StudentsAttendanceReportToPrint extends React.Component {
  render() {
    console.table(this.props.data);
    console.log(this.props.data);
    const renderedData = this.props.data.map((res) => {
      return {
        id: res.id,
        studentName: `${res.studentFirstName} ${res.studentMiddleName} ${res.studentLastName}`,
        dateKey: res.dateKey,
        studentPresentAbsent: res.studentPresentAbsent,
      };
    });
    let datesArr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30, 31,
    ];
    //styling for vertical lines
    const borderRight = {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      fontWeight: "bold",
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
                  <Divider />
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
                    विद्यार्थी उपस्थिती अहवाल
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
            <div style={{ height: "60vh" }}>
              <table style={{ border: "1px solid black", textAlign: "center" }}>
                <tr>
                  <th style={{ width: "20%", border: "1px solid black" }} rowSpan={2}>
                    Student's Name
                  </th>
                  <th style={{ width: "20%" }} colSpan={31}>
                    Date
                  </th>
                </tr>
                <tr>
                  {datesArr.map((obj, j) => {
                    return <td style={{ border: "1px solid black", width: 10 }}>{j + 1}</td>;
                  })}
                </tr>
                {renderedData.map((r) => {
                  return (
                    <tr key={r.id}>
                      <td style={{ border: "1px solid black" }}>{r.studentName}</td>
                      {datesArr.map((obj, i) => {
                        return (
                          <td key={i} style={{ border: "1px solid black", width: 10 }}>
                            {/* {obj % 2 === 0 ? "P" : "A"} */}
                            {obj == r.dateKey ? r.studentPresentAbsent : "-"}
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
