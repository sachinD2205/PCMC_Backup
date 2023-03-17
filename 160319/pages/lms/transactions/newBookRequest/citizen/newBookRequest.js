import {
    Button,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    IconButton,
    Box,
    ThemeProvider,
} from "@mui/material";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../../masters/libraryCompetativeMaster/view.module.css"
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../../theme"
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";



const Index = () => {
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [id, setID] = useState();
    const [bookTypeData, setBookTypeData] = useState([]);
    const [bookClassifications, setBookClassification] = useState([]);
    const [bookSubTypeData, setBookSubType] = useState([]);
    const [languages, setLanguages] = useState([{ id: 1, language: "English" }, { id: 2, language: "Marathi" }, { id: 3, language: "Hindi" }])
    const [libraryKeys, setLibraryKeys] = useState([])
    const router = useRouter()
    let applicationFrom = 'Web'
    const user = useSelector((state) => state?.user.user)


    const language = useSelector((state) => state?.labels.language)

    const {
        register,
        control,
        handleSubmit,
        methods,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
        // resolver: yupResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        getBookClassifications();
        getBookTypeData();
        getLibraryKeys()
        getZoneKeys();

    }, []);

    useEffect(() => {
        if (watch('zoneKey')) {
            getLibraryKeys()
        }

    }, [watch('zoneKey')])

    const [zoneKeys, setZoneKeys] = useState([])
    // getZoneKeys
    const getZoneKeys = () => {
        //setValues("setBackDrop", true);
        axios
            .get(`${urls.CFCURL}/master/zone/getAll`)
            .then((r) => {
                setZoneKeys(
                    r.data.zone.map((row) => ({
                        id: row.id,
                        zoneName: row.zoneName,
                        zoneNameMr: row.zoneNameMr,
                    })),
                )
            })
            .catch((err) => {
                swal('Error!', 'Somethings Wrong Zones not Found!', 'error')
            })
    }


    const getLibraryKeys = () => {
        //setValues("setBackDrop", true);
        axios
            .get(`${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch('zoneKey')}`)
            .then((r) => {
                setLibraryKeys(
                    r.data.libraryMasterList.map((row) => ({
                        id: row.id,
                        // zoneName: row.zoneName,
                        // zoneNameMr: row.zoneNameMr,
                        libraryName: row.libraryName
                    })),
                )
            })
            .catch((err) => {
                swal('Error!', 'Somethings Wrong Zones not Found!', 'error')
            })
    }


    useEffect(() => {

        if (watch('bookType')) {
            axios.get(`${urls.LMSURL}/bookSubTypeMaster/getAll`)
                .then((r) => {
                    setBookSubType(
                        r.data.bookSubTypeMasterList.map((r) => ({
                            id: r.id,
                            bookType: r.bookType,
                            bookSubtype: r.bookSubtype,
                        }))
                    );
                });
        }

    }, [watch('bookType')])

    const getBookClassifications = () => {
        axios
            .get(`${urls.LMSURL}/bookClassificationMaster/getAll`)
            .then((r) => {
                let result = r.data.bookClassificationList;
                console.log("result", result);

                setBookClassification(result.map((r, i) => {
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,

                        id: r.id,
                        srNo: i + 1,
                        bookClassification: r.bookClassification,

                        status: r.activeFlag === "Y" ? "Active" : "Inactive",
                    }
                }
                ))
            })
    }

    const getBookTypeData = () => {
        axios.get(`${urls.LMSURL}/bookTypeMaster/getAll`)
            .then((r) => {
                setBookTypeData(
                    r.data.bookTypeMasterList.map((r) => ({
                        id: r.id,
                        bookType: r.bookType
                    }))
                );
            });
    };

    const onSubmitForm = (formData) => {
        const finalBodyForApi = {
            ...formData,
            applicationFrom,
        };

        const bodyForApi = {
            ...formData,
            applicationFrom,
            serviceId: 84,
            createdUserId: user?.id,
            applicationStatus: 'APPLICATION_CREATED',
        }

        console.log("savebody", finalBodyForApi)
        axios
            .post(
                `${urls.LMSURL}/trnRequestBook/save`,
                bodyForApi,
            )
            .then((res) => {
                if (res.status == 201) {
                    swal('Saved!', 'Record Saved successfully !', 'success')
                    router.push({
                        pathname: `/dashboard`,

                    })
                }
            })
            .catch((err) => {
                swal('Error!', 'Somethings Wrong Record not Saved!', 'error')
            })
        // Save - DB
        // axios
        //     .post(
        //         `${urls.LMSURL}/bookMaster/save`,
        //         finalBodyForApi
        //     )
        //     .then((res) => {
        //         if (res.status == 201) {
        //             formData.id
        //                 ? sweetAlert("Updated!", "Record Updated successfully !", "success")
        //                 : sweetAlert("Saved!", "Record Saved successfully !", "success");
        //             getTableData();
        //             // setButtonInputState(false);
        //             // setIsOpenCollapse(true);
        //             // setEditButtonInputState(false);
        //             // setDeleteButtonState(false);

        //             setButtonInputState(false);
        //             setSlideChecked(false);
        //             setIsOpenCollapse(false);
        //             setEditButtonInputState(false);
        //             setDeleteButtonState(false);
        //         }
        //     });
    };

    const exitButton = () => {
        swal({
            title: 'Exit?',
            text:
                'Are you sure you want to exit this Record ? ',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal('Record is Successfully Exit!', {
                    icon: 'success',
                })
                reset({
                    ...resetValuesExit,
                });
                router.push(`/dashboard`)
            } else {
                swal('Record is Safe')
            }
        })

    };

    // cancell Button
    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };

    const resetValuesCancell = {

        bookClassification: "",
        language: "",
        bookName: "",
        publication: "",
        author: "",
        bookEdition: "",
        bookType: "",
        bookSubType: "",
        libraryKey: "",

    };

    const resetValuesExit = {
        bookClassification: "",
        language: "",
        bookName: "",
        publication: "",
        author: "",
        bookEdition: "",
        bookType: "",
        bookSubType: "",
        libraryKey: "",
        id: null,
    };


    return (
        <>
            <ThemeProvider theme={theme}>
                <Paper
                    elevation={8}
                    variant="outlined"
                    sx={{
                        border: 1,
                        borderColor: "grey.500",
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginTop: "10px",
                        marginBottom: "60px",
                        padding: 1,
                    }}
                >

                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "10px",
                            // backgroundColor:'#0E4C92'
                            // backgroundColor:'		#0F52BA'
                            // backgroundColor:'		#0F52BA'
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h1 style={{
                            color: 'white',
                            margin: "1vh",
                        }}> New Book Request
                        </h1>
                    </Box>


                    <div>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmitForm)}>

                                <Grid
                                    container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ justifyContent: "center", marginTop: "1vh" }}
                                    columns={16}
                                >
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <div>
                                            <FormControl
                                                variant="standard"
                                                sx={{ marginTop: 2 }}
                                                error={!!errors.zoneKey}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* <FormattedLabel id="zone" required /> */}
                                                    Zone
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            //sx={{ width: 230 }}
                                                            // disabled={disable}
                                                            value={field.value}
                                                            onChange={(value) => {
                                                                field.onChange(value)
                                                                console.log(
                                                                    'Zone Key: ',
                                                                    value.target.value,
                                                                )
                                                                // setTemp(value.target.value)
                                                            }}
                                                            label="Zone Name  "
                                                        >
                                                            {zoneKeys &&
                                                                zoneKeys.map((zoneKey, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={zoneKey.id}
                                                                    >
                                                                        {/*  {zoneKey.zoneKey} */}

                                                                        {language == 'en'
                                                                            ? zoneKey?.zoneName
                                                                            : zoneKey?.zoneNameMr}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="zoneKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.zoneKey
                                                        ? errors.zoneKey.message
                                                        : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <div>
                                            <FormControl
                                                variant="standard"
                                                sx={{ marginTop: 2 }}
                                                error={!!errors.libraryKey}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* <FormattedLabel id="zone" required /> */}
                                                    Library/Competitive Study Centre                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            //sx={{ width: 230 }}
                                                            // disabled={disable}
                                                            value={field.value}
                                                            onChange={(value) => {
                                                                field.onChange(value)
                                                                // setTemp(value.target.value)
                                                            }}
                                                            label="Library/Competitive Study Centre"
                                                        >
                                                            {libraryKeys &&
                                                                libraryKeys.map((libraryKey, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={libraryKey.id}
                                                                    >
                                                                        {/* {language == 'en'
                                                                                    ? libraryKey?.libraryName
                                                                                    : libraryKey?.libraryNameMr} */}
                                                                        {libraryKey?.libraryName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="libraryKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.libraryKey
                                                        ? errors.libraryKey.message
                                                        : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ justifyContent: "center", marginTop: "1vh" }}
                                    columns={16}
                                >

                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        {/* <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.bookName}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Book Name *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Book Name"
                                >
                                  {bookTypeData &&
                                    bookTypeData.map((bookName, index) => (
                                      <MenuItem key={index} value={bookName.id}>
                                        {bookName.bookName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="bookName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.bookName ? errors.bookName.message : null}
                            </FormHelperText>
                          </FormControl> */}

                                        <TextField
                                            sx={{ m: 1, width: "100%" }}
                                            id="standard-basic"
                                            label="Book Name"
                                            variant="standard"
                                            {...register("bookName")}
                                            error={!!errors.bookName}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch("bookName") ? true : false)
                                                // ||(router.query.bookName ? true : false),
                                            }}
                                            helperText={
                                                errors?.bookName
                                                    ? errors.bookName.message
                                                    : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        {/* <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.publication}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Publication *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Publication"
                                >
                                  {bookTypeData &&
                                    bookTypeData.map((publication, index) => (
                                      <MenuItem
                                        key={index}
                                        value={publication.id}
                                      >
                                        {publication.publication}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="publication"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.publication
                                ? errors.publication.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}
                                        <TextField
                                            sx={{ m: 1, width: "100%" }}
                                            id="standard-basic"
                                            label="Publication"
                                            variant="standard"
                                            {...register("publication")}
                                            error={!!errors.publication}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch("publication") ? true : false)
                                                // ||(router.query.publication ? true : false),
                                            }}
                                            helperText={
                                                errors?.publication
                                                    ? errors.publication.message
                                                    : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <FormControl
                                            variant="standard"
                                            sx={{ m: 1, width: "100%" }}
                                            error={!!errors.language}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                Language
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        sx={{ width: "100%" }}
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value)}
                                                        label="Language"
                                                    >
                                                        {languages &&
                                                            languages.map((language, index) => (
                                                                <MenuItem key={index} value={language.id}>
                                                                    {language.language}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                )}
                                                name="language"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.language ? errors.language.message : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ justifyContent: "center", marginTop: "1vh" }}
                                    columns={16}
                                >
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <FormControl
                                            variant="standard"
                                            sx={{ m: 1, width: "100%" }}
                                            error={!!errors.bookClassification}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                Book Classification
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        sx={{ width: "100%" }}
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value)}
                                                        label="Book Classification"
                                                    >
                                                        {bookClassifications &&
                                                            bookClassifications.map(
                                                                (bookClassification, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={bookClassification.bookClassification}
                                                                    >
                                                                        {bookClassification.bookClassification}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                )}
                                                name="bookClassification"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.bookClassification
                                                    ? errors.bookClassification.message
                                                    : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <FormControl
                                            variant="standard"
                                            sx={{ m: 1, width: "100%" }}
                                            error={!!errors.bookType}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                Book Type
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        sx={{ width: "100%" }}
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value)}
                                                        label="Book Type"
                                                    >
                                                        {bookTypeData &&
                                                            bookTypeData.map((bookType, index) => (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={bookType.bookType}
                                                                >
                                                                    {bookType.bookType}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                )}
                                                name="bookType"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.bookType
                                                    ? errors.bookType.message
                                                    : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <FormControl
                                            variant="standard"
                                            sx={{ m: 1, width: "100%" }}
                                            error={!!errors.bookSubType}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                Book Sub Type
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        sx={{ width: "100%" }}
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value)}
                                                        label="Book Sub Type"
                                                    >
                                                        {bookSubTypeData &&
                                                            bookSubTypeData.map((bookSubType, index) => (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={bookSubType.bookSubtype}
                                                                >
                                                                    {bookSubType.bookSubtype}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                )}
                                                name="bookSubType"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.bookSubType
                                                    ? errors.bookSubType.message
                                                    : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ justifyContent: "center", marginTop: "1vh" }}
                                    columns={16}
                                >
                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            sx={{ m: 1, width: "100%" }}
                                            id="standard-basic"
                                            label="Author"
                                            variant="standard"
                                            {...register("author")}
                                            error={!!errors.author}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch("author") ? true : false)
                                                // ||(router.query.author ? true : false),
                                            }}
                                            helperText={
                                                errors?.author ? errors.author.message : null
                                            }
                                        />
                                    </Grid>

                                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            sx={{ m: 1, width: "100%" }}
                                            id="standard-basic"
                                            label="Book Edition"
                                            variant="standard"
                                            {...register("bookEdition")}
                                            error={!!errors.bookEdition}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch("bookEdition") ? true : false)
                                                // ||(router.query.bookEdition ? true : false),
                                            }}
                                            helperText={
                                                errors?.bookEdition
                                                    ? errors.bookEdition.message
                                                    : null
                                            }
                                        />
                                    </Grid>

                                </Grid>

                                {/* <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ justifyContent: "center", marginTop: "1vh" }}
                        columns={16}
                      >
                        
                      </Grid> */}

                                <div className={styles.btn}>
                                    <div className={styles.btn1}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="success"
                                            endIcon={<SaveIcon />}
                                        >
                                            {btnSaveText}
                                        </Button>{" "}
                                    </div>
                                    <div className={styles.btn1}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ClearIcon />}
                                            onClick={() => cancellButton()}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                    <div className={styles.btn1}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() => exitButton()}
                                        >
                                            Exit
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>


                </Paper>
            </ThemeProvider>
        </>
    );
};
export default Index;
