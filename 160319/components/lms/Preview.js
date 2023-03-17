import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import NewMembershipRegistration from "../../pages/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration"
import styles from '../../components/marriageRegistration/board.module.css'
import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import { useState } from 'react'
import UploadButton from '../../components/marriageRegistration/DocumentUploadLms'
import { useEffect } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import urls from '../../URLS/urls'
import { useSelector } from 'react-redux'

const Preview = () => {

    let appName = 'LMS'
    let serviceName = 'N-LMS'
    let applicationFrom = 'Web'
    const language = useSelector((state) => state?.labels.language)

    const methods = useFormContext({
        criteriaMode: 'all',
        // resolver: yupResolver(boardschema),
        mode: 'onChange',
        defaultValues: {
            id: null,
        },
    })
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = methods
    const [disable, setDisable] = useState(true)

    const [libraryKeys, setLibraryKeys] = useState([])

    const membershipMonthsKeys = [{
        months: 6,
        label: "6 Months"
    },
    {
        months: 12,
        label: "12 Months"
    },
    ]

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

    useEffect(() => {
        getLibraryKeys()
        getTitles()
        getTitleMr()
        getZoneKeys()
    }, [])

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
    const [atitles, setatitles] = useState([])

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

    return (
        <div>
            <FormProvider {...methods}>
                <form>

                    <>
                        <div
                            className={styles.wardZone}
                            style={{ alignItems: 'center' }}
                        >
                            <div>
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
                                                disabled={disable}
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
                            </div>
                            <div>
                                <FormControl
                                    variant="standard"
                                    sx={{ marginTop: 2 }}
                                    error={!!errors.libraryKey}
                                >
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {/* <FormattedLabel id="zone" required /> */}
                                        Library/Competitive Study Centre
                                    </InputLabel>
                                    <Controller
                                        render={({ field }) => (
                                            <Select
                                                //sx={{ width: 230 }}
                                                disabled={disable}
                                                value={field.value}
                                                onChange={(value) => {
                                                    field.onChange(value)
                                                    console.log(
                                                        'Zone Key: ',
                                                        value.target.value,
                                                    )
                                                    // setTemp(value.target.value)
                                                }}
                                                label="Library/Competitive Study Centre "
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
                            </div>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.h1Tag}>
                                <h3
                                    style={{
                                        color: 'white',
                                        marginTop: '7px',
                                    }}
                                >
                                    {/* {<FormattedLabel id="applicantName" />} */}
                                    Applicant Name
                                </h3>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div>
                                <FormControl
                                    variant="standard"
                                    error={!!errors.atitle}
                                    sx={{ marginTop: 2 }}
                                >
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {/* <FormattedLabel id="titleInenglish" required /> */}
                                        Title In English
                                    </InputLabel>
                                    <Controller
                                        render={({ field }) => (
                                            <Select
                                                // disabled
                                                disabled={disable}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                label="Title  "
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
                            </div>

                            <div>
                                <TextField
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="firstName" required />}
                                    label="First Name (In English)"
                                    variant="standard"
                                    {...register('afName')}
                                    error={!!errors.afName}
                                    helperText={
                                        errors?.afName ? errors.afName.message : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    label="Middle Name (In English)"
                                    // label={<FormattedLabel id="middleName" required />}
                                    variant="standard"
                                    {...register('amName')}
                                    error={!!errors.amName}
                                    helperText={
                                        errors?.amName ? errors.amName.message : null
                                    }
                                />
                            </div>
                            <div>
                                <TextField
                                    // disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    label="Last Name (In English)"
                                    // label={<FormattedLabel id="lastName" required />}
                                    variant="standard"
                                    {...register('alName')}
                                    error={!!errors.alName}
                                    helperText={
                                        errors?.alName ? errors.alName.message : null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div>
                                <FormControl
                                    variant="standard"
                                    error={!!errors.atitlemr}
                                    sx={{ marginTop: 2 }}
                                >
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {/* <FormattedLabel id="titleInmarathi" required /> */}
                                        Title in Marathi
                                    </InputLabel>
                                    <Controller
                                        render={({ field }) => (
                                            <Select
                                                // disabled
                                                disabled={disable}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                label="Title  "
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
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    label="First Name (In Marathi)"
                                    // label={<FormattedLabel id="firstNamemr" required />}
                                    // label=" Hello"
                                    variant="standard"
                                    {...register('afNameMr')}
                                    error={!!errors.afNameMr}
                                    helperText={
                                        errors?.afNameMr ? errors.afNameMr.message : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    label="Middle Name (In Marathi)"
                                    // label={
                                    //     <FormattedLabel id="middleNamemr" required />
                                    // }
                                    // label="मधले नावं *"
                                    variant="standard"
                                    {...register('amNameMr')}
                                    error={!!errors.amNameMr}
                                    helperText={
                                        errors?.amNameMr ? errors.amNameMr.message : null
                                    }
                                />
                            </div>
                            <div>
                                <TextField
                                    // disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    label="Last Name (In Marathi) "
                                    // label={<FormattedLabel id="lastNamemr" required />}
                                    // label="आडनाव *"
                                    variant="standard"
                                    {...register('alNameMr')}
                                    error={!!errors.alNameMr}
                                    helperText={
                                        errors?.alNameMr ? errors.alNameMr.message : null
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.h1Tag}>
                                <h3
                                    style={{
                                        color: 'white',
                                        marginTop: '7px',
                                    }}
                                >
                                    {/* {<FormattedLabel id="Addrees" />} */}
                                    Applicant Details
                                </h3>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={
                                    //     <FormattedLabel id="flatBuildingNo" required />
                                    // }
                                    label="Flat/Building No (In English) "
                                    variant="standard"
                                    {...register('aflatBuildingNo')}
                                    error={!!errors.aflatBuildingNo}
                                    helperText={
                                        errors?.aflatBuildingNo
                                            ? errors.aflatBuildingNo.message
                                            : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={
                                    //     <FormattedLabel id="buildingName" required />
                                    // }
                                    label="Apartment Name (In English)"
                                    variant="standard"
                                    {...register('abuildingName')}
                                    error={!!errors.abuildingName}
                                    helperText={
                                        errors?.abuildingName
                                            ? errors.abuildingName.message
                                            : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="roadName" required />}
                                    label="Road Name (In English)"
                                    variant="standard"
                                    {...register('aroadName')}
                                    error={!!errors.aroadName}
                                    helperText={
                                        errors?.aroadName
                                            ? errors.aroadName.message
                                            : null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.row3}>
                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="Landmark" required />}
                                    label="Landmark (In English)"
                                    variant="standard"
                                    {...register('alandmark')}
                                    error={!!errors.alandmark}
                                    helperText={
                                        errors?.alandmark
                                            ? errors.alandmark.message
                                            : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="cityName" required />}
                                    label="City Name / Village Name (In English)"
                                    variant="standard"
                                    {...register('acityName')}
                                    error={!!errors.acityName}
                                    helperText={
                                        errors?.acityName
                                            ? errors.acityName.message
                                            : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    defaultValue="Maharashtra"
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="State" required />}
                                    label="State (In English)"
                                    variant="standard"
                                    {...register('astate')}
                                    error={!!errors.astate}
                                    helperText={
                                        errors?.astate ? errors.astate.message : null
                                    }
                                />
                            </div>
                        </div>

                        {/* marathi Adress */}

                        <div className={styles.row}>
                            <div>
                                <TextField
                                    disabled={disable}
                                    sx={{ width: 250 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    id="standard-basic"
                                    // label={
                                    //     <FormattedLabel id="flatBuildingNomr" required />
                                    // }
                                    label="Flat/Building No (In Marathi)"
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
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={
                                    //     <FormattedLabel id="buildingNamemr" required />
                                    // }
                                    label="Apartment Name (In Marathi)"
                                    variant="standard"
                                    {...register('abuildingNameMr')}
                                    error={!!errors.abuildingNameMr}
                                    helperText={
                                        errors?.abuildingNameMr
                                            ? errors.abuildingNameMr.message
                                            : null
                                    }
                                />
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    label="Road Name (In Marathi)"
                                    // label={<FormattedLabel id="roadNamemr" required />}
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
                            </div>
                        </div>
                        <div className={styles.row3}>
                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    label="Landmark (In Marathi)"
                                    // label={<FormattedLabel id="Landmarkmr" required />}
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
                            </div>

                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    label="City Name / Village Name (In Marathi)"
                                    // label={<FormattedLabel id="cityNamemr" required />}
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
                            </div>

                            <div>
                                <TextField
                                    defaultValue="महाराष्ट्र"
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 230 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="statemr" required />}
                                    label="State (In Marathi)"
                                    variant="standard"
                                    {...register('astateMr')}
                                    error={!!errors.astateMr}
                                    helperText={
                                        errors?.astateMr ? errors.astateMr.message : null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div>
                                <TextField
                                    //  disabled
                                    disabled={disable}
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
                            </div>
                            <div>
                                <TextField
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="mobileNo" required />}
                                    label="Mobile No"
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
                            </div>

                            <div>
                                <TextField
                                    disabled={disable}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ width: 250 }}
                                    id="standard-basic"
                                    label={<FormattedLabel id="email" required />}
                                    variant="standard"
                                    //  value={pageType ? router.query.emailAddress : ''}
                                    // disabled={router.query.pageMode === 'View'}
                                    {...register('aemail')}
                                    error={!!errors.aemail}
                                    helperText={
                                        errors?.aemail ? errors.aemail.message : null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div>
                                <TextField
                                    InputLabelProps={{
                                        shrink:
                                            (watch('aadharNo') ? true : false)
                                    }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="AadharNo" required />}
                                    label="Aadhar No"
                                    variant="standard"
                                    disabled={disable}
                                    {...register('aadharNo')}
                                    error={!!errors.aadharNo}
                                    helperText={
                                        errors?.aadharNo ? errors.aadharNo.message : null
                                    }
                                />
                            </div>
                        </div>

                        {/* owner details */}

                        <div className={styles.details}>
                            <div className={styles.h1Tag}>
                                <h3
                                    style={{
                                        color: 'white',
                                        marginTop: '7px',
                                    }}
                                >
                                    {/* {<FormattedLabel id="OwnerDetails" />} */}
                                    Membership Details
                                    {/* Owner Details : */}
                                </h3>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div>
                                <FormControl
                                    sx={{ marginTop: 0 }}
                                    error={!!errors.marriageDate}
                                >
                                    <Controller
                                        control={control}
                                        name="startDate"
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterMoment}
                                            >
                                                <DatePicker
                                                    // maxDate={new Date()}
                                                    disabled={disable}
                                                    inputFormat="DD/MM/YYYY"
                                                    label={
                                                        <span style={{ fontSize: 14 }}>
                                                            {' '}
                                                            Membership Start Date
                                                            {/* {<FormattedLabel id="startDate" required />} */}
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
                                        {errors?.startDate
                                            ? errors.startDate.message
                                            : null}
                                    </FormHelperText>
                                </FormControl>
                            </div>
                            <div>
                                <FormControl
                                    variant="standard"
                                    error={!!errors.membershipMonths}
                                    sx={{ marginTop: 2 }}
                                >
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {/* <FormattedLabel id="titleInenglish" required /> */}
                                        Membership for Months
                                    </InputLabel>
                                    <Controller
                                        render={({ field }) => (
                                            <Select
                                                // disabled
                                                disabled={disable}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                label="Membership for Months"
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
                            </div>

                        </div>
                    </>

                    <>
                        <div className={styles.details}>
                            <div className={styles.h1Tag}>
                                <h3
                                    style={{
                                        color: 'white',
                                        marginTop: '7px',
                                    }}
                                >
                                    Documents Upload
                                    {/* {<FormattedLabel id="document" />} */}
                                </h3>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div style={{ marginTop: '20px' }}>
                                <Typography>
                                    {' '}
                                    Identity Proof
                                    {/* {<FormattedLabel id="adharcard" />} */}
                                </Typography>

                                <UploadButton
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues('aadharCardDoc')}
                                    fileKey={'aadharCardDoc'}
                                // showDel={pageMode ? false : true}

                                // showDel={true}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <Typography>
                                    {' '}
                                    Address Proof
                                    {/* {<FormattedLabel id="adharcard" />} */}
                                </Typography>

                                <UploadButton
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues('aadharCardDoc1')}
                                    fileKey={'aadharCardDoc1'}
                                // showDel={pageMode ? false : true}

                                // showDel={true}
                                />
                            </div>
                        </div>
                    </>

                    {/* <NewMembershipRegistration/> */}
                </form>
            </FormProvider>
        </div>
    )
}

export default Preview