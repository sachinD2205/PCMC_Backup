import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class ClassTimetableReportToPrint extends React.Component {
  render() {
    console.log("this.props.data", this?.props?.data);
    console.log("teacherSubData", this?.props?.teacherSubData);
    let teacherSubData = this?.props?.teacherSubData;

    const data = this.props.data.map((r) => {
      return {
        id: r.id,
        schoolName: r.schoolName,
        academicYearName: r.academicYearName,
        className: r.className,
        divisionName: r.divisionName,
      };
    });
    const renderedData = this.props.data[0].timeTableDao.map((r) => {
      return {
        id: r.id,
        time: `${r.fromTime} To ${r.toTime}`,
        periodDao: r.periodDao,
      };
    });

    console.log("data", data);
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
                <Typography>शाळेचे नाव : {data[0]?.schoolName}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>वर्गाचे नाव : {data[0]?.className ? data[0]?.className : "---"}</Typography>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <Typography>विभागणी: {data[0]?.divisionName ? data[0]?.divisionName : "---"}</Typography>
              </Grid>
            </Grid>
            {/* <Divider sx={{ borderBottomWidth: 5 }} /> */}
            <div style={{ height: "20vh", width: "100vw" }}>
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
                  <th style={border}>Mon</th>
                  <th style={border}>Tues</th>
                  <th style={border}>Wedn</th>
                  <th style={border}>Thu</th>
                  <th style={border}>Fri</th>
                  <th style={border}>Sat</th>
                </tr>
                {renderedData.map((obj, j) => {
                  let day = obj.periodDao;
                  return (
                    <tr key={obj.id}>
                      <td style={border}>{j + 1}</td>
                      <td style={border}>{obj.time}</td>
                      <td style={border}>{day.monDay}</td>
                      <td style={border}>{day.tuesDay}</td>
                      <td style={border}>{day.wednesDay}</td>
                      <td style={border}>{day.thursday}</td>
                      <td style={border}>{day.friDay}</td>
                      <td style={border}>{day.saturDay}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
            {/* <Divider sx={{ borderBottomWidth: 5 }} /> */}
            {teacherSubData?.length > 0 && (
              <div style={{ width: "100vw" }}>
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
                    <th style={border}>Subject</th>
                    <th style={border}>Teacher</th>
                  </tr>
                  {teacherSubData.map((obj, j) => {
                    // let day = obj.periodDao;
                    return (
                      <tr key={obj.id}>
                        <td style={border}>{j + 1}</td>
                        <td style={border}>{obj.subjectName}</td>
                        <td style={border}>{obj.teacherName}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
