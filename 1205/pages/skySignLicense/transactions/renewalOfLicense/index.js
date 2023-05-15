import {
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    ThemeProvider,
    TextField,
    Box,
    Grid,
    FormControl,
    FormHelperText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../../theme";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { router } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import urls from "../../../../URLS/urls";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const Index = () => {
    const methods = useForm({

        mode: "onChange",
        criteriaMode: "all",
        // resolver: yupResolver(Schema),
    });

    const {
        errors,
        getValues,
        setValue,
        reset,
        watch,
        control,
        register,
        handleSubmit,
    } = methods;

    const language = useSelector((state) => state?.labels.language);

    const dispach = useDispatch();
    const [licenseType, setlicenseType] = useState([]);
    const [searchFlag, setSearchFlag] = useState(false)

    // useEffect(() => {
    //     // reset(router?.query);
    //     if (router.query.id) {
    //         axios
    //             .get(
    //                 `${urls.SSLM}/Trn/ApplicantDetails/getApplicationById?appId=${router.query.id}`
    //             )
    //             .then((r) => {
    //                 reset(r.data);
    //             });
    //     }
    // }, []);
    useEffect(() => {
        getlicenseType();

    }, [])
    const getlicenseType = () => {
        axios
            .get(`${urls.SSLM}/master/MstLicenseType/getAll`)
            .then((r) => {
                setlicenseType(
                    r.data.MstLicenseType.map((row) => ({
                        id: row.id,
                        licenseTypeEn: row.licenseType,
                        licenseTypeMar: row.licenseTypeMar,
                    })),
                );
            });
    };

    const handleSearch = () => {
        if (watch('licenseNo')) {

            console.log("filter", watch('licenseNo'));
        } else if (watch('organizationName') && watch('aadharNo') && watch('mstLicensetypekey')) {
            console.log("filter1", watch('organizationName'), watch('aadharNo'), watch('mstLicensetypekey'));

        }
        else if (watch('organizationName1') && watch('mobileNo') && watch('mstLicensetypekey1')) {
            console.log("filter2", watch('organizationName1'), watch('mobileNo'), watch('mstLicensetypekey1'));

        }
        setSearchFlag(true)

    }
    // Handle Next
    const handleNext = () => {
        console.log("Form  Submit Data --->",);
        //dispach(addIsssuanceofLicenseSlice(data));
        // console.log("data", data);
        // if (activeStep == steps.length - 1) {
        //   axios
        //     .post(
        //       `${urls.SSLM}/Trn/ApplicantDetails/saveTrnApplicantDetails`,
        //       data
        //       // {
        //       //   headers: {
        //       //     role: "CITIZEN",
        //       //   },
        //       // },
        //     )
        //     .then((res) => {
        //       if (res.status == 201) {
        //         data.id
        //           ? sweetAlert(
        //             "Updated!",
        //             "Record Updated successfully !",
        //             "success"
        //           )
        //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
        //         router.push(`/dashboard`);
        //       }
        //     });
        // } else {
        //   setActiveStep(activeStep + 1);
        // }
    };

    // // Handle Back
    const handleExit = () => {
        router.push({
            pathname: `/dashboard`,
        })
    };
    // useEffect(() => {
    //     // reset(router?.query);
    //     if (router.query.id) {
    //         axios
    //             .get(
    //                 `${urls.SSLM}/Trn/ApplicantDetails/getApplicationById?appId=${router.query.id}`
    //             )
    //             .then((r) => {
    //                 reset(r.data);
    //             });
    //     }
    // }, [router.query.pagemode]);



    // View
    return (
        <>

            <ThemeProvider theme={theme}>
                <Paper
                    component={Box}
                    sx={
                        {
                            marginLeft: '10px',
                            marginRight: '10px',
                            paddingTop: '5vh',
                            paddingBottom: '2vh',

                        }
                    }
                    square
                    elevation={5}
                >
                    <FormProvider {...methods}>
                        <form sx={{ marginTop: 10 }}>
                            <div
                                style={{
                                    backgroundColor: "#0084ff",
                                    color: "white",
                                    fontSize: 19,
                                    padding: 8,
                                    paddingLeft: "5vh",
                                    marginLeft: "5vh",
                                    marginRight: "15vh",
                                    // marginTop: "10vh",
                                    paddingTop: "2vh",
                                    borderRadius: 100,
                                }}
                            >
                                <strong> Renewal of License </strong>
                            </div>
                            <Accordion
                                sx={{
                                    marginLeft: "5vh",
                                    marginRight: "5vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        1) Filter (License No. *)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='License No. *'
                                                variant='standard'
                                                {...register("licenseNo")}
                                                error={!!errors?.licenseNo}
                                                helperText={
                                                    errors?.licenseNo ? errors.licenseNo?.message : null
                                                }
                                            />
                                        </Grid>

                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                sx={{
                                    marginLeft: "5vh",
                                    marginRight: "5vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        2) Filter (Organization Name,Aadhar No,License Type)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName")}
                                                error={!!errors?.organizationName}
                                                helperText={
                                                    errors?.organizationName
                                                        ? errors?.organizationName?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='Aadhar No. *'
                                                variant='standard'
                                                {...register("aadharNo")}
                                                error={!!errors?.aadharNo}
                                                helperText={
                                                    errors?.aadharNo ? errors.aadharNo?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ marginTop: 2 }} error={!!errors?.licenseType}>
                                                <InputLabel id='demo-simple-select-standard-label'>
                                                    {<FormattedLabel id="licenseType"></FormattedLabel>}

                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            label='License Type *'
                                                        >
                                                            {licenseType &&
                                                                licenseType.map((licenseType, index) => (
                                                                    <MenuItem key={index} value={licenseType.id}>
                                                                        {licenseType.licenseType}

                                                                        {language == 'en'
                                                                            ?
                                                                            licenseType?.licenseTypeEn
                                                                            : licenseType?.licenseTypeMar}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name='mstLicensetypekey'
                                                    control={control}
                                                    defaultValue=''
                                                />
                                                <FormHelperText>
                                                    {errors?.licenseType ? errors.licenseType?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>


                            </Accordion>
                            <Accordion
                                sx={{
                                    marginLeft: "5vh",
                                    marginRight: "5vh",
                                    marginTop: "2vh",
                                    marginBottom: "2vh",
                                    // paddingLeft:"5vh",
                                    // paddingRight:"5vh",
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        textTransform: "uppercase",
                                        // marginLeft: "5vh",
                                        // marginRight: "5vh",
                                    }}
                                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    backgroundColor="#0070f3"
                                >
                                    <Typography>
                                        3) Filter (Organization Name,Mobile No,License Type)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName1")}
                                                error={!!errors?.organizationName1}
                                                helperText={
                                                    errors?.organizationName1
                                                        ? errors?.organizationName1?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField

                                                id='standard-basic'
                                                label='Mobile No.'
                                                variant='standard'
                                                {...register("mobileNo")}
                                                error={!!errors?.mobileNo}
                                                helperText={
                                                    errors?.mobileNo ? errors.mobileNo?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl sx={{ marginTop: 2 }} error={!!errors?.mstLicensetypekey1}>
                                                <InputLabel id='demo-simple-select-standard-label'>
                                                    {<FormattedLabel id="licenseType"></FormattedLabel>}

                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            label='License Type *'
                                                        >
                                                            {licenseType &&
                                                                licenseType.map((licenseType, index) => (
                                                                    <MenuItem key={index} value={licenseType.id}>
                                                                        {licenseType.licenseType}

                                                                        {language == 'en'
                                                                            ?
                                                                            licenseType?.licenseTypeEn
                                                                            : licenseType?.licenseTypeMar}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name='mstLicensetypekey1'
                                                    control={control}
                                                    defaultValue=''
                                                />
                                                <FormHelperText>
                                                    {errors?.mstLicensetypekey1 ? errors.mstLicensetypekey1?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>


                            </Accordion>
                            <Grid
                                container
                                sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, justifyContent: "center" }}
                            >

                                <Grid item
                                    xl={4}
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        // disabled={validateSearch()}
                                        onClick={() => {
                                            handleSearch();
                                        }}
                                    >
                                        {<FormattedLabel id="search" />}
                                        {/* Search */}
                                    </Button>
                                </Grid>

                            </Grid>
                            {searchFlag ? (
                                <>
                                    < div
                                        style={{
                                            backgroundColor: "#0084ff",
                                            color: "white",
                                            fontSize: 19,
                                            padding: 8,
                                            paddingLeft: "5vh",
                                            marginLeft: "5vh",
                                            marginRight: "15vh",
                                            // marginTop: "10vh",
                                            paddingTop: "2vh",
                                            borderRadius: 100,
                                        }}
                                    >
                                        <strong> Organization Information</strong>
                                    </div>
                                    <Grid
                                        container
                                        spacing={1}
                                        columns={12}
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5 }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                id='standard-basic'
                                                disabled
                                                // label={<FormattedLabel id="applicationNumber" />}
                                                label="Organization Name"
                                                variant='standard'
                                                {...register("organizationName2")}
                                                error={!!errors?.organizationName2}
                                                helperText={
                                                    errors?.organizationName2
                                                        ? errors?.organizationName2?.message
                                                        : null
                                                }
                                            />
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <TextField
                                                disabled
                                                id='standard-basic'
                                                label='Applicant Name.'
                                                variant='standard'
                                                {...register("applicantName")}
                                                error={!!errors?.applicantName}
                                                helperText={
                                                    errors?.applicantName ? errors.applicantName?.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <FormControl error={!!errors?.previousExpiryDate} sx={{ marginTop: 0 }}>
                                                <Controller
                                                    sx={{ marginTop: 0 }}

                                                    control={control}
                                                    name='previousExpiryDate'
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                disabled
                                                                inputFormat='DD/MM/YYYY'
                                                                // label={
                                                                //     <FormattedLabel id="dateOfBirth" />

                                                                // }
                                                                label="Previous Expiry Date"
                                                                value={field.value}
                                                                onChange={(date) =>
                                                                    field.onChange(
                                                                        moment(date).format('YYYY-MM-DD'),
                                                                    )
                                                                }
                                                                // selected={field.value}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size='small'
                                                                        fullWidth
                                                                        InputLabelProps={{
                                                                            style: {
                                                                                // fontSize: 12,
                                                                                marginTop: 3,
                                                                            },
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.previousExpiryDate ? errors?.previousExpiryDate?.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                    <Grid
                                        container
                                        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, justifyContent: "center" }}
                                    >

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    handleNext();
                                                }}
                                            >
                                                {<FormattedLabel id="submit" />}
                                                {/* Search */}
                                            </Button>
                                        </Grid>
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                // disabled={validateSearch()}
                                                onClick={() => {
                                                    handleExit();
                                                }}
                                            >
                                                {<FormattedLabel id="exit" />}
                                                {/* Search */}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : ""
                            }
                        </form>

                    </FormProvider>
                </Paper>
            </ThemeProvider>
        </>
    );
};

export default Index;
