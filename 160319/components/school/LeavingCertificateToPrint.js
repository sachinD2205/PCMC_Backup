import { Grid, Box, Typography, Divider } from "@mui/material";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import styles from "../security/ComponentToPrint.module.css"
// class component To Print
export default class LeavingCertificateToPrint extends React.Component {
    render() {
        //for current date
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear());
        let todaysDate = `${dd}/${mm}/${yy}`;

        console.log(this.props.data, "props");
        console.log(todaysDate, "todaysDate");
        console.log(this.props.data, "props");
        return (
            <>
                <div className={styles.main} style={{ border: "2px solid black" }}>
                    <div className={styles.small} style={{ margin: "5px" }}>
                        <Grid container sx={{ padding: "6px" }}>
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
                                    }}>पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 25, fontWeight: 'bold', m: 1
                                    }}>शाळा सोडल्याचा दाखला</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 16, fontWeight: 'regular', m: 1
                                    }}>( ग्रँट - इन - एड कोडाच्या १७ व्या नियमाप्रमाणे)</Box>
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                            </Grid>
                        </Grid>
                        <Divider />
                        <div style={{ marginLeft: "5px" }}>
                            <Grid container sx={{ padding: "6px" }} style={{ textAlign: "center" }}>

                                <Grid item xs={4}>
                                    {" "}
                                    <Typography>School Name : {this?.props?.data?.schoolName}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        Student Register Number :{" "}
                                        {this?.props?.data?.studentGeneralRegisterNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {" "}
                                    <Typography>
                                        UDICE Code: 11111111111
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ borderBottomWidth: 5 }} />

                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        1. Student Full Name :{" "}
                                        {this?.props?.data?.studentName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        2. Student Mother Name : {this?.props?.data?.studentMotherName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        3. Religion and Caste : {this?.props?.data?.religion}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        4. Citizen : {this?.props?.data?.citizen}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        5. BirthPlace, Dist and Tal : {this?.props?.data?.studentPlaceOfBirth}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        6. Date of birth, month and year as per Christian Calender : {moment(this?.props?.data?.studentDateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        {" "}In alphanumeric : {this?.props?.data?.alphanumeric}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        7. School Name that the student attended before coming to this school : {this?.props?.data?.lastSchoolName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        8. School Admission Date : {moment(this?.props?.data?.dateOfAdmission, "YYYY-MM-DD").format("DD-MM-YYYY")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        9. Study Progress : {this?.props?.data?.studyProgress}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        10. Student Behaviour at school : {this?.props?.data?.studentBehaviour}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        11. School leaving date in month and year : {moment(this?.props?.data?.schoolLeavingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        12. In which grade and since when was he studying : {this?.props?.data?.lastClassAndFrom}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        {" "}In alphanumeric : {this?.props?.data?.alphanumeric}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        13. Reason for leaving the school : {this?.props?.data?.leavingReason}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        14. Grade : {this?.props?.data?.grade}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        It is certified that the above information is in the base of school register no.1
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={4}>
                                    <Typography> Date :{" "}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {" "}
                                    <Typography>Month : </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {" "}
                                    <Typography> Year :  </Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "10px" }}>

                                <Grid item xs={6}>
                                    {" "}
                                    <Typography>Principal Sign : {" "}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ padding: "6px" }}>
                                <Grid item xs={12}>
                                    <Typography>
                                        Note: 1. Unauthorized alteration of school leaving certificate is a serious offence.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}