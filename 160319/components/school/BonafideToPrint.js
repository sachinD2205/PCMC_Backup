import { Grid, Box, Typography, Divider } from "@mui/material";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import styles from "../security/ComponentToPrint.module.css"
// class component To Print
export default class BonafideToPrint extends React.Component {

    render() {

        //for current date
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear());
        let todaysDate = `${dd}/${mm}/${yy}`;

        console.log(this.props.data, "props");
        console.log(todaysDate, "todaysDate");
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
                                    }}>बोनाफाईड प्रमाणपत्र</Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center", fontSize: 16, fontWeight: 'regular', m: 1
                                    }}>( ग्रँट - इन - एड कोडाच्या १७ व्या नियमाप्रमाणे)</Box>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ borderBottomWidth: 5 }} />

                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={4}>
                                <Typography>
                                    Date :{" "}
                                    {todaysDate}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    This is to certify that {" "} {this?.props?.data?.studentName} {" "} is a student of {this?.props?.data?.schoolName} currently studying in class {this?.props?.data?.className} and division {this?.props?.data?.divisionName} .
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    According to school record, he/she belongs to --- Category, His/Her birth date is {moment(this?.props?.data?.studentDateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    and place of birth is ---. His/Her residential permanent address is {this?.props?.data?.studentAddress}
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
                        <Grid container sx={{ padding: "10px" }}>

                            <Grid item xs={6}>
                                {" "}
                                <Typography>Principal Sign : {" "}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ padding: "6px" }}>
                            <Grid item xs={12}>
                                <Typography>
                                    Note: 1. Unauthorized alteration of Bonafide Certificate is a serious offence.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </>
        );
    }
}