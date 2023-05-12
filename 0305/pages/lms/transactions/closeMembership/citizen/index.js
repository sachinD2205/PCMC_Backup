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
import { closeMembershipSchema } from '../../../../../components/lms/schema/closeMembershipSchema';
import { yupResolver } from '@hookform/resolvers/yup';


const Index = (props) => {

    let appName = 'LMS'
    let serviceName = 'C-LMS'
    let applicationFrom = 'Web'
    const user = useSelector((state) => state?.user.user)
    const router = useRouter()


    const closeMember = useForm({
        resolver: yupResolver(closeMembershipSchema),
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

    const [showDetails, setShowDetails] = useState(false);
    const [memberName, setMemberName] = useState();
    const [isPendingDue, setIsPendingDue] = useState(false);
    const [isPendingBook, setIsPendingBook] = useState(false);

    useEffect(() => {
        setAllLibrariesList()
        // getAllBooks()

        if (props.disabled) {
            setShowDetails(true)
        }
        console.log('aalanai', props.id);
        // if(props.id){
        //     axios
        //     .get(
        //       `${urls.LMSURL}/trnCloseMembership/getByIdAndServiceId?id=${props?.id}&serviceId=${86}`,
        //     )
        //     .then((res) => {
        //       console.log(res, "reg123")
        //       reset(res.data)

        //     })
        // }
    }, [])


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
                console.log("yetay error", err?.response?.data?.message)
                swal(err?.response?.data?.message, { icon: 'error' })
            })
    }

    const getMembershipDetails = () => {
        console.log("data", watch('membershipNo'), watch('libraryKey'));
        if (watch('membershipNo')) {
            const url =
                urls.LMSURL +
                '/libraryMembership/getByMembershipDetailsForCancelMembership?membershipNo=' + watch('membershipNo') + '&libraryKey=' + watch('libraryKey')
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
                    setValue('startDate', response.data.startDate)
                    setValue('endDate', response.data.endDate)
                    setMemberName(response.data.applicantName);
                    //finePending
                    setIsPendingDue(response?.data?.finePending)
                    //bookPending
                    setIsPendingBook(response?.data?.bookPending)
                    // setIsPendingBook(true)
                    setShowDetails(true);
                })
                .catch((err) => {
                    console.error(err)
                    swal(err.response?.data?.message, { icon: 'error' })
                })
        }
    }


    const onSubmitForm = (data) => {
        const bodyForApi = {
            ...data,
            createdUserId: user?.id,
            applicationFrom,
            // serviceCharges: null,
            serviceId: 86,
            applicationStatus: 'APPLICATION_CREATED',
        }
        console.log('Final Data: ', bodyForApi)

        // Save - DB

        axios
            .post(`${urls.LMSURL}/trnCloseMembership/save`, bodyForApi)
            .then((res) => {
                if (res.status == 201) {
                    swal('Saved!', 'Record Saved successfully !', 'success')
                    // router.push({
                    //     pathname: `/dashboard`,
                    // })
                    let temp = res?.data?.message;
                    router.push({
                        pathname: `/lms/transactions/closeMembership/acknowledgmentReceipt`,
                        query: {
                            id: Number(temp.split(':')[1]),
                        },
                    })
                }
            })

            .catch((err) => {
                console.log("err123", err.response?.data?.status);
                if (err?.response?.data?.status == 409) {
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
                                    {<FormattedLabel id="closeMembership" />}
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
                                    {!props.disabled ? (
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
                                        <div className={styles.details1TABLE}>
                                            <div className={styles.h2TagTABLE}>
                                                <h2
                                                    style={{
                                                        fontSize: '20',
                                                        color: 'white',
                                                        marginTop: '7px',
                                                    }}
                                                >
                                                    {' '}
                                                    {<FormattedLabel id="membershipDetails" />}
                                                    {/* Membership Details */}
                                                </h2>
                                            </div>
                                        </div>
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
                                                <TextField
                                                    disabled
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{ width: 230 }}
                                                    id="standard-basic"
                                                    label={<FormattedLabel id="memberName" required />}
                                                    // label="Member Name"
                                                    variant="standard"
                                                    {...register('memberName')}
                                                    error={!!errors.memberName}
                                                    helperText={
                                                        errors?.memberName ? errors.memberName.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                style={{ marginTop: '1vh' }}
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}>
                                                <FormControl
                                                    sx={{ marginTop: 0 }}
                                                    error={!!errors.startDate}
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
                                                                    disabled
                                                                    // maxDate={new Date()}
                                                                    // disabled={disable}
                                                                    inputFormat="DD/MM/YYYY"
                                                                    label={
                                                                        <span style={{ fontSize: 14 }}>
                                                                            {' '}
                                                                            {/* Membership Start Date */}
                                                                            {<FormattedLabel id="startDate" required />}
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
                                            </Grid>
                                            <Grid
                                                item
                                                style={{ marginTop: '1vh' }}
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}>
                                                <FormControl
                                                    sx={{ marginTop: 0 }}
                                                    error={!!errors.endDate}
                                                >
                                                    <Controller
                                                        control={control}
                                                        name="endDate"
                                                        defaultValue={null}
                                                        render={({ field }) => (
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterMoment}
                                                            >
                                                                <DatePicker
                                                                    disabled
                                                                    // maxDate={new Date()}
                                                                    // disabled={disable}
                                                                    inputFormat="DD/MM/YYYY"
                                                                    label={
                                                                        <span style={{ fontSize: 14 }}>
                                                                            {' '}
                                                                            {/* Membership End Date */}
                                                                            {<FormattedLabel id="endDate" required />}
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
                                                        {errors?.endDate
                                                            ? errors.endDate.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            container
                                            spacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                            columns={16}
                                        >
                                            {isPendingDue ? (
                                                <Grid item
                                                    style={{ marginTop: '4vh' }}
                                                    xl={4}
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}>
                                                    <TextField
                                                        disabled
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        sx={{ width: 230 }}
                                                        id="standard-basic"
                                                        label={<FormattedLabel id="dues" required />}
                                                        // label="Pending Dues"
                                                        variant="standard"
                                                        {...register('dues')}
                                                        error={!!errors.dues}
                                                        helperText={
                                                            errors?.dues ? errors.dues.message : null
                                                        }
                                                    />
                                                </Grid>
                                            ) : ""}
                                            <Grid item
                                                style={{ marginTop: '1vh' }}
                                                xl={4}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}>
                                                <TextareaAutosize
                                                    //  InputLabelProps={{ shrink: true }}
                                                    aria-label="minimum height"
                                                    minRows={3}
                                                    placeholder="Reason for Membership Closure"
                                                    style={{ marginTop: 40, width: 300 }}
                                                    id='standard-basic'
                                                    // label="Reason"
                                                    label={<FormattedLabel id="reason" required />}
                                                    {...register("reason")}
                                                    error={!!errors.reason}
                                                    helperText={
                                                        errors?.reason ? errors.reason.message : null
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        {!props.disabled ? (
                                            <>
                                                {isPendingBook ? (
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                                        style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                                        columns={16}
                                                    >
                                                        <span style={{ marginLeft: "12vh", fontSize: "2vh", color: "red", fontWeight: 600 }}>Note :- Please First Return the Issued Book</span>
                                                    </Grid>) : ""}
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                                    style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                                    columns={16}
                                                >
                                                    {!isPendingBook ? (
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
                                                    ) : ""}
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
