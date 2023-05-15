import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextareaAutosize,
    TextField,
    ThemeProvider,
} from '@mui/material'
import theme from '../../../../../theme';
import styles from '../../../../../styles/lms/[closeMembership]view.module.css'
import InIcon from '@mui/icons-material/Input'
import OutIcon from '@mui/icons-material/Output'
import urls from '../../../../../URLS/urls';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import swal from 'sweetalert';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import SaveIcon from '@mui/icons-material/Save'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'

import { renewalOfMembershipSchema } from '../../../../../components/lms/schema/renewalOfMembershipSchema';
import { yupResolver } from '@hookform/resolvers/yup';

const Index = (props) => {

    let appName = 'LMS'
    let serviceName = 'C-LMS'
    let applicationFrom = 'Web'
    const user = useSelector((state) => state?.user.user)
    const router = useRouter()


    const closeMember = useForm({
        resolver: yupResolver(renewalOfMembershipSchema),
        mode: 'onChange',
    })
    const {
        register,
        control,
        handleSubmit,
        methods,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = closeMember

    const [libraryIdsList, setLibraryIdsList] = useState([])
    const [selectedLibraryId, setSelectedLibraryId] = useState(null)
    const [buttonInputState, setButtonInputState] = useState()
    const [atitles, setatitles] = useState([])


    const [showDetails, setShowDetails] = useState(false);
    const [memberName, setMemberName] = useState();
    const [oldId, setOldId] = useState();
    const [oldStartDate, setOldStartDate] = useState();
    const [oldEndDate, setOldEndDate] = useState();
    const [tempDisabled, setTempDisabled] = useState();

    const membershipMonthsKeys = [{
        months: 6,
        label: "6 Months"
    },
    {
        months: 12,
        label: "12 Months"
    },
    ]

    useEffect(() => {
        setAllLibrariesList()
        getZoneKeys()
        getTitles()
        getTitleMr()
        // getAllBooks()

        if (props.disabled) {
            setShowDetails(true)
            setTempDisabled(props.disabled)
        } {
            setTempDisabled(true)
        }
        console.log('aalanai', props.id);
        if (router?.query?.id) {
            axios
                .get(
                    `${urls.LMSURL}/trnRenewalOfMembership/getByIdAndServiceId?id=${router?.query?.id}&serviceId=${90}`,
                )
                .then((res) => {
                    console.log(res, "reg123")
                    setShowDetails(true)
                    reset(res.data)
                    // setValue('lastEndDate', res.data.endDateOld)

                })
        }
    }, [])

    const language = useSelector((state) => state?.labels.language)
    const [libraryKeys, setLibraryKeys] = useState([])
    useEffect(() => {
        if (watch('zoneKey')) {
            getLibraryKeys()
        }
    }, [watch('zoneKey')])

    const getLibraryKeys = () => {
        //setValues("setBackDrop", true);
        axios
            .get(
                `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
                    'zoneKey',
                )}`,
            )
            .then((r) => {
                setLibraryKeys(
                    r.data.libraryMasterList.map((row) => ({
                        id: row.id,
                        // zoneName: row.zoneName,
                        // zoneNameMr: row.zoneNameMr,
                        libraryName: row.libraryName,
                    })),
                )
            })
    }
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

    const getTitles = async () => {
        await axios
            .get(`${urls.BaseURL}/title/getAll`)
            .then((r) => {
                setatitles(
                    r.data.title.map((row) => ({
                        id: row.id,
                        atitle: row.title,
                        // titlemr: row.titlemr,
                    })),
                )
            })
            .catch((err) => {
                swal('Error!', 'Somethings Wrong Titles not Found!', 'error')
            })
    }
    const [TitleMrs, setTitleMrs] = useState([])
    const getTitleMr = async () => {
        await axios
            .get(`${urls.BaseURL}/title/getAll`)
            .then((r) => {
                setTitleMrs(
                    r.data.title.map((row) => ({
                        id: row.id,
                        atitlemr: row.titleMr,
                    })),
                )
            })
            .catch((err) => {
                swal('Error!', 'Somethings Wrong Titles not Found!', 'error')
            })
    }

    const setAllLibrariesList = () => {
        const url = urls.LMSURL + '/libraryMaster/getAll'
        axios
            .get(url)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Error getting libraries')
                }
                if (
                    !response.data ||
                    !response.data.libraryMasterList ||
                    response.data.libraryMasterList.length === 0
                ) {
                    throw new Error('No libraries found')
                }
                setLibraryIdsList(response.data.libraryMasterList.sort((a,b)=>a.id-b.id))
            })
            .catch((err) => {
                console.error(err)
                swal(err.message, { icon: 'error' })
            })
    }

    const getMembershipDetails = () => {
        console.log("data", watch('membershipNo'), watch('libraryKey'));
        if (watch('membershipNo')) {
            const url =
                urls.LMSURL +
                '/libraryMembership/getByMembershipNoAndLibraryKey?membershipNo=' + watch('membershipNo') + '&libraryKey=' + watch('libraryKey')
            axios
                .get(url)
                .then((response) => {
                    // if (
                    //   !response.data ||
                    //   !response.data.trnBookIssueReturnList ||
                    //   response.data.trnBookIssueReturnList.length === 0
                    // ) {
                    //   throw new Error('No books found')
                    // }
                    // setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
                    setValue('memberName', response.data.applicantName)
                    setValue('endDate', response.data.endDate)
                    setMemberName(response.data.applicantName);
                    setOldId(response.data.id)
                    setOldStartDate(response.data.startDate)
                    setOldEndDate(response.data.endDate)
                    setShowDetails(true);
                    reset(response.data)
                    setValue('startDate', new Date())
                })
                .catch((err) => {
                    console.error(err)
                    swal(err.response.data.message, { icon: 'error' })
                })
        }
    }


    const onSubmitForm = (data) => {

        let bodyForApi;

        if (router?.query?.side) {
            bodyForApi = {
                ...data,
                // id: null,
                createdUserId: user?.id,
                applicationFrom,
                // serviceCharges: null,
                serviceId: 90,
                applicationStatus: 'APPLICATION_CREATED',
                oldId: oldId,
                startDateOld: oldStartDate,
                endDateOld: oldEndDate,
            }
        }
        else {
            bodyForApi = {
                ...data,
                id: null,
                createdUserId: user?.id,
                applicationFrom,
                // serviceCharges: null,
                serviceId: 90,
                applicationStatus: 'APPLICATION_CREATED',
                oldId: oldId,
                startDateOld: oldStartDate,
                endDateOld: oldEndDate,
            }
        }
        console.log('Final Data: ', bodyForApi)

        // Save - DB

        axios
            .post(`${urls.LMSURL}/trnRenewalOfMembership/save`, bodyForApi)
            .then((res) => {
                if (res.status == 201) {
                    swal('Saved!', 'Record Saved successfully !', 'success')
                    // router.push({
                    //     pathname: `/dashboard`,
                    // })
                    let temp = res?.data?.message;
                    router.push({
                        pathname: `/lms/transactions/renewMembership/acknowledgmentReceipt`,
                        query: {
                            id: Number(temp.split(':')[1]),
                        },
                    })
                }
            })

            .catch((err) => {
                console.log("err123", err.response.data.status);
                if (err.response.data.status == 409) {
                    swal('Error!', 'Application for this member already exist!', 'error')

                }
                else {
                    swal('Error!', 'Somethings Wrong Record not Saved!', 'error')
                }
            })

    }
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ThemeProvider theme={theme}>
                    <Paper
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginTop: 5,
                            marginBottom: 5,
                            padding: 1,
                        }}
                        id="paper-top"
                    >
                        <div className={styles.detailsTABLE}>
                            <div className={styles.h1TagTABLE}>
                                <h2
                                    style={{
                                        fontSize: '20',
                                        color: 'white',
                                        marginTop: '7px',
                                    }}
                                >
                                    {' '}
                                    {<FormattedLabel id="renewMembership" />}
                                    {/* Close Membership */}
                                </h2>
                            </div>
                        </div>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmitForm)}>
                                <Grid
                                    container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                    columns={16}
                                >
                                    <Grid item
                                        style={{ marginTop: '1vh' }}
                                        xl={4}
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}>

                                        <div>
                                            <FormControl
                                                variant="standard"
                                                error={!!errors.libraryKey}
                                                sx={{ marginTop: 2 }}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    <FormattedLabel id="libraryCSC" required />
                                                    {/* Choose a library */}
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // disabled
                                                            // disabled={disable}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            // label="Choose a library"
                                                            label={<FormattedLabel id="libraryCSC" required />}
                                                            id="demo-simple-select-standard"
                                                            labelId="id='demo-simple-select-standard-label'"
                                                        >
                                                            {libraryIdsList &&
                                                                libraryIdsList.map((library, index) => (
                                                                    <MenuItem key={index} value={library.id}>
                                                                        {library.libraryName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="libraryKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.libraryKey ? errors.libraryKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid
                                        // style={{ marginTop: '1vh' }}
                                        item
                                        xl={4}
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >

                                        <TextField
                                            // disabled
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{ width: 230 }}
                                            id="standard-basic"
                                            label={<FormattedLabel id="membershipNo" required />}
                                            // label="Membership No"
                                            variant="standard"
                                            {...register('membershipNo')}
                                            error={!!errors.membershipNo}
                                            helperText={
                                                errors?.membershipNo ? errors.membershipNo.message : null
                                            }
                                        />
                                    </Grid>
                                    {!router?.query.side ? (
                                        <Grid
                                            style={{ marginTop: '4vh' }}
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Button
                                                type="button"
                                                variant="contained"
                                                endIcon={<OutIcon />}
                                                style={{ marginRight: '20px' }}
                                                // type="primary"
                                                onClick={() => {
                                                    getMembershipDetails()
                                                }}
                                            >
                                                <FormattedLabel id="searchMember" />

                                                {/* Search Member */}
                                            </Button>
                                        </Grid>
                                    ) : ""}

                                </Grid>
                                {showDetails ? (
                                    <>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    variant="standard"
                                                    sx={{ marginTop: 2 }}
                                                    error={!!errors.zoneKey}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="zone" />
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                //sx={{ width: 230 }}
                                                                disabled={watch('zoneKey') ? true : false}
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
                                                                        <MenuItem key={index} value={zoneKey.id}>
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
                                                        {errors?.zoneKey ? errors.zoneKey.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >

                                                <FormControl
                                                    variant="standard"
                                                    sx={{ marginTop: 2 }}
                                                    error={!!errors.libraryKey}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="libraryCSC" required />
                                                        {/* Library/Competitive Study Centre */}
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                //sx={{ width: 230 }}
                                                                // disabled={disable}
                                                                disabled={watch('libraryKey') ? true : false}
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    field.onChange(value)
                                                                    console.log(
                                                                        'Zone Key: ',
                                                                        value.target.value,
                                                                    )
                                                                    // setTemp(value.target.value)
                                                                }}
                                                                // label="Library/Competitive Study Centre "
                                                                label={<FormattedLabel id="libraryCSC" required />}
                                                            >
                                                                {libraryKeys &&
                                                                    libraryKeys.map((libraryKey, index) => (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={libraryKey.id}
                                                                        >
                                                                            {/*  {zoneKey.zoneKey} */}

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

                                            </Grid>

                                        </Grid>
                                        <div className={styles.details1TABLE}>
                                            <div className={styles.h2TagTABLE}>
                                                <h3
                                                    style={{
                                                        color: 'white',
                                                        marginTop: '7px',
                                                    }}
                                                >
                                                    {<FormattedLabel id="applicantName" />}
                                                    {/* Applicant Name */}
                                                </h3>
                                            </div>
                                        </div>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    variant="standard"
                                                    error={!!errors.atitle}
                                                    sx={{ marginTop: 2 }}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="titleEn" required />
                                                        {/* Title In English */}
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                // disabled
                                                                // disabled={disable}
                                                                disabled={watch('atitle') ? true : false}
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                label={<FormattedLabel id="titleEn" required />}
                                                                id="demo-simple-select-standard"
                                                                labelId="id='demo-simple-select-standard-label'"
                                                            >
                                                                {atitles &&
                                                                    atitles.map((atitle, index) => (
                                                                        <MenuItem key={index} value={atitle.id}>
                                                                            {atitle.atitle}
                                                                            {/* {language == 'en'
                                                     ? atitle?.title
                                                     : atitle?.titleMr} */}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="atitle"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {errors?.atitle ? errors.atitle.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled={disable}
                                                    disabled={watch('afName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="fnameEn" required />}
                                                    // label="First Name (In English)"
                                                    variant="standard"
                                                    {...register('afName')}
                                                    error={!!errors.afName}
                                                    helperText={
                                                        errors?.afName ? errors.afName.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('amName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    // label="Middle Name (In English)"
                                                    label={<FormattedLabel id="mnameEn" required />}
                                                    variant="standard"
                                                    {...register('amName')}
                                                    error={!!errors.amName}
                                                    helperText={
                                                        errors?.amName ? errors.amName.message : null
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled
                                                    // disabled={disable}
                                                    disabled={watch('alName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    // label="Last Name (In English)"
                                                    label={<FormattedLabel id="lnameEn" required />}
                                                    variant="standard"
                                                    {...register('alName')}
                                                    error={!!errors.alName}
                                                    helperText={
                                                        errors?.alName ? errors.alName.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    variant="standard"
                                                    error={!!errors.atitlemr}
                                                    sx={{ marginTop: 2 }}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="titleMr" required />
                                                        {/* Title in Marathi */}
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                // disabled
                                                                // disabled={disable}
                                                                disabled={watch('atitlemr') ? true : false}
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                label={<FormattedLabel id="titleMr" required />}
                                                                id="demo-simple-select-standard"
                                                                labelId="id='demo-simple-select-standard-label'"
                                                            >
                                                                {TitleMrs &&
                                                                    TitleMrs.map((atitlemr, index) => (
                                                                        <MenuItem key={index} value={atitlemr.id}>
                                                                            {atitlemr.atitlemr}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="atitlemr"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {errors?.atitlemr
                                                            ? errors.atitlemr.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('afNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    // label="First Name (In Marathi)"
                                                    label={<FormattedLabel id="fnameMr" required />}
                                                    // label=" Hello"
                                                    variant="standard"
                                                    {...register('afNameMr')}
                                                    error={!!errors.afNameMr}
                                                    helperText={
                                                        errors?.afNameMr ? errors.afNameMr.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('amNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    // label="Middle Name (In Marathi)"
                                                    label={
                                                        <FormattedLabel id="mnameMr" required />
                                                    }
                                                    // label="मधले नावं *"
                                                    variant="standard"
                                                    {...register('amNameMr')}
                                                    error={!!errors.amNameMr}
                                                    helperText={
                                                        errors?.amNameMr ? errors.amNameMr.message : null
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled
                                                    // disabled={disable}
                                                    disabled={watch('alNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    // label="Last Name (In Marathi) "
                                                    label={<FormattedLabel id="lnameMr" required />}
                                                    // label="आडनाव *"
                                                    variant="standard"
                                                    {...register('alNameMr')}
                                                    error={!!errors.alNameMr}
                                                    helperText={
                                                        errors?.alNameMr ? errors.alNameMr.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>

                                        <div className={styles.details1TABLE}>
                                            <div className={styles.h2TagTABLE}>
                                                <h3
                                                    style={{
                                                        color: 'white',
                                                        marginTop: '7px',
                                                    }}
                                                >
                                                    {<FormattedLabel id="ApplicatDetails" />}
                                                    {/* Applicant Details */}
                                                </h3>
                                            </div>
                                        </div>

                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('aflatBuildingNo') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={
                                                        <FormattedLabel id="flatBuildingNo" required />
                                                    }
                                                    // label="Flat/Building No (In English) "
                                                    variant="standard"
                                                    {...register('aflatBuildingNo')}
                                                    error={!!errors.aflatBuildingNo}
                                                    helperText={
                                                        errors?.aflatBuildingNo
                                                            ? errors.aflatBuildingNo.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('abuildingName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={
                                                        <FormattedLabel id="buildingName" required />
                                                    }
                                                    // label="Apartment Name (In English)"
                                                    variant="standard"
                                                    {...register('abuildingName')}
                                                    error={!!errors.abuildingName}
                                                    helperText={
                                                        errors?.abuildingName
                                                            ? errors.abuildingName.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('aroadName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="roadNameEn" required />}
                                                    // label="Road Name (In English)"
                                                    variant="standard"
                                                    {...register('aroadName')}
                                                    error={!!errors.aroadName}
                                                    helperText={
                                                        errors?.aroadName
                                                            ? errors.aroadName.message
                                                            : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('alandmark') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="landmarkEn" required />}
                                                    // label="Landmark (In English)"
                                                    variant="standard"
                                                    {...register('alandmark')}
                                                    error={!!errors.alandmark}
                                                    helperText={
                                                        errors?.alandmark
                                                            ? errors.alandmark.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('acityName') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="cityOrVillageEn" required />}
                                                    // label="City Name / Village Name (In English)"
                                                    variant="standard"
                                                    {...register('acityName')}
                                                    error={!!errors.acityName}
                                                    helperText={
                                                        errors?.acityName
                                                            ? errors.acityName.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    defaultValue="Maharashtra"
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('astate') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="state" required />}
                                                    // label="State (In English)"
                                                    variant="standard"
                                                    {...register('astate')}
                                                    error={!!errors.astate}
                                                    helperText={
                                                        errors?.astate ? errors.astate.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* marathi Adress */}

                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled={disable}
                                                    disabled={watch('aflatBuildingNoMr') ? true : false}
                                                    sx={{ width: 250 }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    id="standard-basic"
                                                    label={
                                                        <FormattedLabel id="flatBuildingNoMr" required />
                                                    }
                                                    // label="Flat/Building No (In Marathi)"
                                                    variant="standard"
                                                    //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                                    //  value={pflatBuildingNo}
                                                    // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                                                    {...register('aflatBuildingNoMr')}
                                                    error={!!errors.aflatBuildingNoMr}
                                                    helperText={
                                                        errors?.aflatBuildingNoMr
                                                            ? errors.aflatBuildingNoMr.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('abuildingNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={
                                                        <FormattedLabel id="buildingNameMr" required />
                                                    }
                                                    // label="Apartment Name (In Marathi)"
                                                    variant="standard"
                                                    {...register('abuildingNameMr')}
                                                    error={!!errors.abuildingNameMr}
                                                    helperText={
                                                        errors?.abuildingNameMr
                                                            ? errors.abuildingNameMr.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('aroadNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    // label="Road Name (In Marathi)"
                                                    label={<FormattedLabel id="roadNameMr" required />}
                                                    // label="गल्लीचे नाव"
                                                    variant="standard"
                                                    {...register('aroadNameMr')}
                                                    error={!!errors.aroadNameMr}
                                                    helperText={
                                                        errors?.aroadNameMr
                                                            ? errors.aroadNameMr.message
                                                            : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('alandmarkMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    // label="Landmark (In Marathi)"
                                                    label={<FormattedLabel id="landmarkMr" required />}
                                                    // label="जमीन चिन्ह"
                                                    variant="standard"
                                                    {...register('alandmarkMr')}
                                                    error={!!errors.alandmarkMr}
                                                    helperText={
                                                        errors?.alandmarkMr
                                                            ? errors.alandmarkMr.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('acityNameMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    // label="City Name / Village Name (In Marathi)"
                                                    label={<FormattedLabel id="cityOrVillageMr" required />}
                                                    // label="शहराचे नाव"
                                                    variant="standard"
                                                    {...register('acityNameMr')}
                                                    error={!!errors.acityNameMr}
                                                    helperText={
                                                        errors?.acityNameMr
                                                            ? errors.acityNameMr.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    defaultValue="महाराष्ट्र"
                                                    // disabled={disable}
                                                    disabled={watch('astateMr') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="stateMr" required />}
                                                    // label="State (In Marathi)"
                                                    variant="standard"
                                                    {...register('astateMr')}
                                                    error={!!errors.astateMr}
                                                    helperText={
                                                        errors?.astateMr ? errors.astateMr.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    //  disabled
                                                    // disabled={disable}
                                                    disabled={watch('apincode') ? true : false}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="pincode" required />}
                                                    variant="standard"
                                                    {...register('apincode')}
                                                    error={!!errors.apincode}
                                                    helperText={
                                                        errors?.apincode ? errors.apincode.message : null
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled={disable}
                                                    disabled={watch('amobileNo') ? true : false}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="mobile" required />}
                                                    // label="Mobile No"
                                                    variant="standard"
                                                    // value={pageType ? router.query.mobile : ''}
                                                    // disabled={router.query.pageMode === 'View'}
                                                    {...register('amobileNo')}
                                                    error={!!errors.amobileNo}
                                                    helperText={
                                                        errors?.amobileNo
                                                            ? errors.amobileNo.message
                                                            : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    // disabled={disable}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 250 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="email" required />}
                                                    variant="standard"
                                                    //  value={pageType ? router.query.emailAddress : ''}
                                                    // disabled={router.query.pageMode === 'View'}
                                                    disabled={watch('aemail') ? true : false}
                                                    {...register('aemail')}
                                                    error={!!errors.aemail}
                                                    helperText={
                                                        errors?.aemail ? errors.aemail.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    InputLabelProps={{
                                                        shrink:
                                                            (watch('aadharNo') ? true : false) ||
                                                            (router.query.aadharNo ? true : false),
                                                    }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="aadharNo" required />}
                                                    // label="Aadhar No"
                                                    variant="standard"
                                                    disabled={watch('aadharNo') ? true : false}
                                                    {...register('aadharNo')}
                                                    error={!!errors.aadharNo}
                                                    helperText={
                                                        errors?.aadharNo ? errors.aadharNo.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* owner details */}

                                        <div className={styles.details1TABLE}>
                                            <div className={styles.h2TagTABLE}>
                                                <h3
                                                    style={{
                                                        color: 'white',
                                                        marginTop: '7px',
                                                    }}
                                                >
                                                    {<FormattedLabel id="membershipDetails" />}
                                                    {/* Membership Details */}
                                                    {/* Owner Details : */}
                                                </h3>
                                            </div>
                                        </div>

                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    sx={{ marginTop: 0 }}
                                                    error={!!errors.lastEndDate}
                                                >
                                                    <Controller
                                                        control={control}
                                                        name="lastEndDate"
                                                        defaultValue={null}
                                                        render={({ field }) => (
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterMoment}
                                                            >
                                                                <DatePicker
                                                                    // maxDate={new Date()}
                                                                    // disabled={disable}
                                                                    disabled
                                                                    inputFormat="DD/MM/YYYY"
                                                                    label={
                                                                        <span style={{ fontSize: 14 }}>
                                                                            {' '}
                                                                            {/* Membership Start Date */}
                                                                            {<FormattedLabel id="lastEndDate" required />}
                                                                        </span>
                                                                    }
                                                                    value={oldEndDate}
                                                                    onChange={(date) =>
                                                                        field.onChange(
                                                                            moment(date).format('YYYY-MM-DD'),
                                                                        )
                                                                    }
                                                                    selected={field.value}
                                                                    center
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            // disabled={disabled}
                                                                            {...params}
                                                                            size="small"
                                                                            fullWidth
                                                                            InputLabelProps={{
                                                                                style: {
                                                                                    fontSize: 12,
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
                                                        {errors?.lastEndDate
                                                            ? errors.lastEndDate.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    sx={{ marginTop: 0 }}
                                                    error={!!errors.applicationDate}
                                                >
                                                    <Controller
                                                        control={control}
                                                        name="applicationDate"
                                                        defaultValue={null}
                                                        render={({ field }) => (
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterMoment}
                                                            >
                                                                <DatePicker
                                                                    // maxDate={new Date()}
                                                                    // disabled={disable}
                                                                    disabled
                                                                    inputFormat="DD/MM/YYYY"
                                                                    label={
                                                                        <span style={{ fontSize: 14 }}>
                                                                            {' '}
                                                                            {/* Membership Start Date */}
                                                                            {<FormattedLabel id="applicationDate" required />}
                                                                        </span>
                                                                    }
                                                                    value={field.value}
                                                                    onChange={(date) =>
                                                                        field.onChange(
                                                                            moment(date).format('YYYY-MM-DD'),
                                                                        )
                                                                    }
                                                                    selected={field.value}
                                                                    center
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            // disabled={disabled}
                                                                            {...params}
                                                                            size="small"
                                                                            fullWidth
                                                                            InputLabelProps={{
                                                                                style: {
                                                                                    fontSize: 12,
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
                                                        {errors?.applicationDate
                                                            ? errors.applicationDate.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            <Grid
                                                // style={{ marginTop: '1vh' }}
                                                item
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControl
                                                    variant="standard"
                                                    error={!!errors.membershipMonths}
                                                    sx={{ marginTop: 2 }}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="membershipMonths" required />
                                                        {/* Membership for Months */}
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                // disabled
                                                                // disabled={disable}
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                label={<FormattedLabel id="membershipMonths" required />}
                                                                // label="Membership for Months"
                                                                id="demo-simple-select-standard"
                                                                labelId="id='demo-simple-select-standard-label'"
                                                            >
                                                                {membershipMonthsKeys &&
                                                                    membershipMonthsKeys.map((membershipMonths, index) => (
                                                                        <MenuItem key={index} value={membershipMonths.months}>
                                                                            {membershipMonths.label}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="membershipMonths"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {errors?.membershipMonths ? errors.membershipMonths.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                        </Grid>
                                        {tempDisabled ? (
                                            <>

                                                <Grid
                                                    container
                                                    spacing={2}
                                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                                    style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                                    columns={16}
                                                >

                                                    <Grid item
                                                        style={{ marginTop: '4vh' }}
                                                        xl={4}
                                                        lg={4}
                                                        md={4}
                                                        sm={12}
                                                        xs={12}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="success"
                                                            endIcon={<SaveIcon />}
                                                        >
                                                            {<FormattedLabel id="save" />}
                                                            {/* save */}
                                                        </Button>
                                                    </Grid>

                                                    <Grid item
                                                        style={{ marginTop: '4vh' }}
                                                        xl={4}
                                                        lg={4}
                                                        md={4}
                                                        sm={12}
                                                        xs={12}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
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
                                                                        router.push({
                                                                            pathname: `/dashboard`,
                                                                        })

                                                                    } else {
                                                                        swal('Record is Safe')
                                                                    }
                                                                })
                                                            }}
                                                        >
                                                            <FormattedLabel id="exit" />
                                                            {/* exit */}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : ""}
                                    </>
                                ) : ""}
                            </form>
                        </FormProvider>
                    </Paper>
                </ThemeProvider>
            </LocalizationProvider>
        </>
    )
}

export default Index;
