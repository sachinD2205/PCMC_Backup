import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
import moment from "moment";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// class component To Print
export default class StudentsMarksReportToPrint extends React.Component {

    render() {
        console.log("props", this.props.data);
        const renderedData = this.props.data.map(({ id, subjectName, subjectRemark, examTermName }) => ({ id, subjectName, subjectRemark, examTermName }));
        // console.log(renderedData, "renderedData");
        const stuData = this.props.stuData;
        console.log("stuData", stuData);

        //for dynamic age calc
        const dob = stuData?.dateOfBirth;
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        // console.log("dob", dob);
        // console.log("age", age);

        //styling for vertical lines
        const borderRight = {
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            fontWeight: 'bold'
        }
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
                                <Typography component="div" style={{ justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        fontWeight: 'bold', m: 1
                                    }}><img src="/logo.png" alt="" height="100vh" width="100vw" />
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        fontWeight: 'bold', m: 1
                                    }}>शिक्षण मंडळ</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 16, fontWeight: 'regular', m: 1
                                    }}>पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८.</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 16, fontWeight: 'regular', m: 1
                                    }}>इयत्ता १ ली ते ७ वी</Box>
                                    <Divider />
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 25,
                                        fontWeight: 'bold', m: 1
                                    }}>● विद्यार्थी प्रगति पत्रक ●</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 16, fontWeight: 'regular', m: 1
                                    }}>सन २०{' '} - २०{' '}</Box>
                                </Typography>
                            </Grid>

                        </Grid>
                        <Divider sx={{ borderBottomWidth: 5 }} />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    शाळेचे नाव :{" "}
                                    {stuData?.schoolName}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    वैयक्तिक माहिती :{" "}
                                    {stuData?.personalInformation}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    विद्यार्थ्याचे नाव :{" "}
                                    {`${stuData?.firstName} ${stuData?.middleName} ${stuData?.lastName}`}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    हजेरी क्र :{" "}
                                    {stuData?.rollNumber}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }} style={{ textAlign: "center" }}>
                            <Grid item xs={4}>
                                {" "}
                                <Typography style={{ float: "left" }}>इयत्ता : {stuData?.className}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>
                                    तुकडी :{" "}
                                    {stuData?.divisionName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {" "}
                                <Typography>
                                    रजि.नं. : {stuData?.admissionRegitrationNo}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }} style={{ textAlign: "center" }}>
                            <Grid item xs={6}>
                                <Typography style={{ float: "left" }}>
                                    वडिलांचे नाव :{" "}
                                    {`${stuData?.fatherFirstName} ${stuData?.fatherMiddleName} ${stuData?.fatherLastName}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    व्यवसाय :{" "}
                                    {stuData?.parentOccupation}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }} style={{ textAlign: "center" }}>
                            <Grid item xs={6}>
                                <Typography style={{ float: "left" }}>
                                    आईचे नाव :{" "}
                                    {stuData?.motherName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    व्यवसाय :{" "}
                                    {stuData?.parentOccupation}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }} style={{ textAlign: "center" }}>
                            <Grid item xs={6}>
                                <Typography style={{ float: "left" }}>
                                    मातृभाषा :{" "}
                                    {stuData?.motherTongue}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    माध्यम :{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }} style={{ textAlign: "center" }}>
                            <Grid item xs={6}>
                                <Typography style={{ float: "left" }}>
                                    जन्मतारीख :{" "}
                                    {moment(stuData?.dateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    वय :{" "}
                                    {age}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    पत्ता :{" "}
                                    {stuData?.parentAddress}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    दुरध्वनी / इ.मेल.नं. :{" "}
                                    {`${stuData?.contactDetails} / ${stuData.studentEmailId}`}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    आरोग्यविषयक माहिती -{" "}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ padding: "10px" }} >

                            <Grid item xs={6}>
                                <Typography>
                                    वजन :{" "}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    उंची :{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ borderBottomWidth: 5 }} />
                        <div style={{ marginTop: "100px" }}>
                            <TableContainer component={Paper}>
                                <Typography component="div" style={{
                                    justifyContent: "center", alignItems: "center", display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    fontWeight: 'bold', m: 1
                                }}>वर्णनात्मक नोंदी</Typography>
                                <Divider />
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={borderRight}>विषय</TableCell>
                                            <TableCell align="center" style={borderRight}>प्रथम सत्र</TableCell>
                                            <TableCell align="center" style={borderRight}>द्वितीय सत्र</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderedData.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" style={borderRight}>
                                                    {row.subjectName}
                                                </TableCell>
                                                <TableCell align="center" style={borderRight}>{row.subjectRemark}</TableCell>
                                                <TableCell align="center" style={borderRight}>{row.subjectRemarkTerm2}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}