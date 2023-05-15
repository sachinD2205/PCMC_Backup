import {
    Grid,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import axios from "axios";
import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/router";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";


/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
// import UploadButton from "../../FileUpload/UploadButton.js";
import UploadButton from "../../../../components/fileUpload/UploadButton";



let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
    }),
);



const SiteVisit = () => {
    const router = useRouter();
    const {
        watch,
        control,
        register,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        watch("siteVisitRemark");
        console.log(
            "siteVisitPhoto3",
            watch("siteVisitPhoto3"),
            watch("siteVisitRemark"),
        );
    }, []);

    // OnSubmit Form
    const handleNext = (formData) => {
        const finalBodyForApi = {
            ...formData,
            applicationId,
        };
        axios
            .post(`${urls.HMSURL}/trnSiteVisit/save`, finalBodyForApi)
            .then((res) => {
                props.siteVisitDailogP(false);
                if (res.status == 200) {
                    formData.id
                        ? sweetAlert("Updated!", "Record Updated successfully !", "success")
                        : sweetAlert("Saved!", "Record Saved successfully !", "success");
                }
            });
    };

    const [photo1, setphoto1] = useState(null);
    const [photo2, setphoto2] =
        useState(null);
    const [photo3, setphoto3] = useState(null);
    const [photo4, setphoto4] = useState(null);
    const [photo5, setphoto5] = useState(null);

    // @ First UseEffect
    useEffect(() => {
        if (getValues("photo2") != null) {
            setphoto2(
                getValues("photo2")
            );
        }
        if (getValues("photo1") != null) {
            setphoto1(getValues("photo1"));
        }
        if (getValues("photo3") != null) {
            setphoto3(getValues("photo3"));
        }
        if (getValues("photo4") != null) {
            setphoto4(getValues("photo4"));
        }
        if (getValues("photo5") != null) {
            setphoto5(getValues("photo5"));
        }

    }, []);

    // @ Second UseEffect
    useEffect(() => {
        setValue("photo2", photo2);
        setValue("photo1", photo1);
        setValue("photo3", photo3);
        setValue("photo4", photo4);
        setValue("photo5", photo5);

    }, [
        photo2,
        photo1,
        photo3,
        photo4,
        photo5,

    ]);


    return (
        <>
            {/** Main Component  */}
            <Main>

                <div
                    style={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        fontSize: 19,
                        marginTop: 30,
                        marginBottom: 30,
                        padding: 8,
                        paddingLeft: 30,
                        marginLeft: "40px",
                        marginRight: "65px",
                        borderRadius: 100,
                    }}
                >
                    {/* <FormattedLabel id='applicantInformation' /> */}
                    Site Visit
                </div>
                <Grid
                    container
                    sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 1</Typography> */}
                        {/* {<FormattedLabel id="photo1" />} */}
                        {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo1");
                            }}
                        /> */}

                        <div className={styles.attachFile}>
                            <UploadButton
                                appName="SSLM"
                                serviceName="S-sitevisit"
                                filePath={setphoto1}
                                fileName={photo1}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 2</Typography> */}
                        {/* {<FormattedLabel id="photo1" />} */}
                        {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo2");
                            }}
                        /> */}
                        <div className={styles.attachFile}>
                            <UploadButton
                                appName="SSLM"
                                serviceName="S-sitevisit"
                                filePath={setphoto2}
                                fileName={photo2}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 3</Typography> */}
                        {/* {<FormattedLabel id="photo1" />} */}
                        {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo3");
                            }}
                        /> */}
                        <div className={styles.attachFile}>
                            <UploadButton
                                appName="SSLM"
                                serviceName="S-sitevisit"
                                filePath={setphoto3}
                                fileName={photo3}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 4</Typography> */}
                        {/* {<FormattedLabel id="photo1" />} */}
                        {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo4");
                            }}
                        /> */}
                        <div className={styles.attachFile}>
                            <UploadButton
                                appName="SSLM"
                                serviceName="S-sitevisit"
                                filePath={setphoto4}
                                fileName={photo4}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                        {/* <Typography variant='subtitle2'>Upload Photo 5</Typography> */}
                        {/* {<FormattedLabel id="photo1" />} */}
                        {/* <UploadButton
                            Change={(e) => {
                                handleFile1(e, "photo5");
                            }}
                        /> */}
                        <div className={styles.attachFile}>
                            <UploadButton
                                appName="SSLM"
                                serviceName="S-sitevisit"
                                filePath={setphoto5}
                                fileName={photo5}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                            id='standard-basic'
                            label={<FormattedLabel id="crLattitude"></FormattedLabel>}
                            {...register("trnApplicantDetailsDao.crLattitude")}
                            error={!!errors.crLattitude}
                            helperText={
                                errors?.crLattitude ? errors.crLattitude.message : null
                            }
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                            //  InputLabelProps={{ shrink: true }}
                            id='standard-basic'
                            label={<FormattedLabel id="crLongitud"></FormattedLabel>}
                            {...register("crLongitud")}
                            error={!!errors.crLongitud}
                            helperText={
                                errors?.crLongitud ? errors.crLongitud.message : null
                            }
                        />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextareaAutosize
                            //  InputLabelProps={{ shrink: true }}
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Remark"
                            style={{ marginTop: 40, width: 1000 }}
                            id='standard-basic'
                            label="Remark"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                                errors?.remark ? errors.remark.message : null
                            }
                        />
                    </Grid>


                </Grid>
            </Main >


        </>
    );
};

export default SiteVisit;
