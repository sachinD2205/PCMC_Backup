// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, Slide, TextField, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import sweetAlert from 'sweetalert'
// import styles from '../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css'
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { GridToolbar } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
// import urls from "../../../../URLS/urls";
import { useRouter } from 'next/router'
import urls from '../../../../URLS/urls'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import styles from './view.module.css'
import { ThemeProvider } from '@emotion/react'
import theme from '../../../../theme'

const Index = () => {
    const {
        register,
        control,
        handleSubmit,
        methods,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        criteriaMode: 'all',
        // resolver: yupResolver(schema),
        mode: 'onChange',
    })

    const [btnSaveText, setBtnSaveText] = useState('save')
    const [dataSource, setDataSource] = useState([])
    const [buttonInputState, setButtonInputState] = useState()
    const [isOpenCollapse, setIsOpenCollapse] = useState(false)
    const [id, setID] = useState()
    const [fetchData, setFetchData] = useState(null)
    const [editButtonInputState, setEditButtonInputState] = useState(false)
    const [deleteButtonInputState, setDeleteButtonState] = useState(false)
    const [slideChecked, setSlideChecked] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const router = useRouter()

    const language = useSelector((state) => state.labels.language)

    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    })
    const [zoneKeys, setZoneKeys] = useState([])

    useEffect(() => {
        // getBookClassifications()
        getZoneKeys()
    }, [])

    useEffect(() => {
        getBookClassifications()
    }, [fetchData, zoneKeys])



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
    // Get Table - Data
    const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
        console.log('_pageSize,_pageNo', _pageSize, _pageNo)
        axios
            .get(`${urls.LMSURL}/libraryMaster/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(';r', r)
                let result = r.data.libraryMasterList
                console.log('result', result)
                let pno = r.data?.pageNo
                let psize = r.data?.pageSize
                let _res = result.map((r, i) => {
                    console.log('44')
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,

                        id: r.id,
                        srNo: (pno * psize) + (i + 1),
                        // bookType: r.bookType,
                        libraryName: r.libraryName,
                        libraryNameMr: r.libraryNameMr,
                        libraryType: r.libraryType,
                        zone: zoneKeys?.find((item) => item.id == r.zoneKey)?.zoneName,
                        status: r.activeFlag === 'Y' ? 'Active' : 'Inactive',
                    }
                })
                setDataSource([..._res])
                setData({
                    rows: _res,
                    totalRows: r.data.totalElements,
                    rowsPerPageOptions: [10, 20, 50, 100],
                    pageSize: r.data.pageSize,
                    page: r.data.pageNo,
                })
            })
    }

    const onSubmitForm = (fromData) => {
        console.log('fromData', fromData)
        // Save - DB
        let _body = {
            ...fromData,
            activeFlag: fromData.activeFlag,
        }
        if (btnSaveText === 'save') {
            const tempData = axios
                .post(`${urls.LMSURL}/libraryMaster/save`, _body)
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert('Saved!', 'Record Saved successfully !', 'success')

                        setButtonInputState(false)
                        setIsOpenCollapse(false)
                        setFetchData(tempData)
                        setEditButtonInputState(false)
                        setDeleteButtonState(false)
                    }
                })
        }
        // Update Data Based On ID
        else if (btnSaveText === 'update') {
            const tempData = axios
                .post(`${urls.LMSURL}/libraryMaster/save`, _body)
                .then((res) => {
                    console.log('res', res)
                    if (res.status == 201) {
                        fromData.id
                            ? sweetAlert(
                                'Updated!',
                                'Record Updated successfully !',
                                'success',
                            )
                            : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
                        getBookClassifications()
                        // setButtonInputState(false);
                        setEditButtonInputState(false)
                        setDeleteButtonState(false)
                        setIsOpenCollapse(false)
                    }
                })
        }
    }

    // Delete By ID
    const deleteById = (value, _activeFlag) => {
        let body = {
            activeFlag: _activeFlag,
            id: value,
        }
        console.log('body', body)
        if (_activeFlag === 'N') {
            swal({
                title: 'Inactivate?',
                text: 'Are you sure you want to inactivate this Record ? ',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log('inn', willDelete)
                if (willDelete === true) {
                    axios
                        // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
                        .post(`${urls.LMSURL}/libraryMaster/save`, body)
                        .then((res) => {
                            console.log('delet res', res)
                            if (res.status == 201) {
                                swal('Record is Successfully Deleted!', {
                                    icon: 'success',
                                })
                                getBookClassifications()
                                // setButtonInputState(false);
                            }
                        })
                } else if (willDelete == null) {
                    swal('Record is Safe')
                }
            })
        } else {
            swal({
                title: 'Activate?',
                text: 'Are you sure you want to activate this Record ? ',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log('inn', willDelete)
                if (willDelete === true) {
                    axios
                        // .delete(`${urls.LMSURL}/bookTypeMaster/delete/${body.id}`)
                        .post(`${urls.LMSURL}/libraryMaster/save`, body)
                        .then((res) => {
                            console.log('delet res', res)
                            if (res.status == 201) {
                                swal('Record is Successfully Activated!', {
                                    icon: 'success',
                                })
                                // getPaymentRate();
                                getBookClassifications()
                                // setButtonInputState(false);
                            }
                        })
                } else if (willDelete == null) {
                    swal('Record is Safe')
                }
            })
        }
    }

    // Exit Button
    const exitButton = () => {
        reset({
            ...resetValuesExit,
        })
        setButtonInputState(false)
        setSlideChecked(false)
        setSlideChecked(false)
        setIsOpenCollapse(false)
        setEditButtonInputState(false)
        setDeleteButtonState(false)
    }

    // cancell Button
    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        })
    }

    // Reset Values Cancell
    const resetValuesCancell = {

        libraryName: "",
        libraryNameMr: "",
        libraryType: "",
        zoneKey: null

    }

    // Reset Values Exit
    const resetValuesExit = {
        libraryName: "",
        libraryNameMr: "",
        libraryType: "",
        zoneKey: null,
        id: null,
    }

    const columns = [
        {
            field: 'srNo',
            // headerName: 'id',
            headerName: <FormattedLabel id="id" />,
            flex: 1
        },
        {
            field: 'zone',
            // headerName: 'Book Type',
            headerName: <FormattedLabel id="zone" />,
            flex: 1,
        },
        {
            field: 'libraryType',
            // headerName: 'Book Type',
            headerName: <FormattedLabel id="libraryType" />,
            flex: 1,
        },

        {
            field: 'libraryName',
            // headerName: 'Book Type',
            headerName: <FormattedLabel id="libraryName" />,
            flex: 1,
        },
        {
            field: 'libraryNameMr',
            // headerName: 'Book Type',
            headerName: <FormattedLabel id="libraryNameMr" />,
            flex: 1,
        },

        {
            field: 'actions',
            // headerName: 'Actions',
            headerName: <FormattedLabel id="actions" />,
            width: 120,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton
                            disabled={editButtonInputState}
                            onClick={() => {
                                setBtnSaveText('update'),
                                    setID(params.row.id),
                                    setIsOpenCollapse(true),
                                    setSlideChecked(true)
                                // setButtonInputState(true);
                                console.log('params.row: ', params.row)
                                reset(params.row)
                                setValue('zoneKey', zoneKeys?.find((item) => item.zoneName == params.row.zone)?.id)

                            }}
                        >
                            <EditIcon style={{ color: '#556CD6' }} />
                        </IconButton>
                        {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
                        <IconButton
                            disabled={editButtonInputState}
                            onClick={() => {
                                setBtnSaveText('update'),
                                    setID(params.row.id),
                                    //   setIsOpenCollapse(true),
                                    setSlideChecked(true)
                                // setButtonInputState(true);
                                console.log('params.row: ', params.row)
                                reset(params.row)
                            }}
                        >
                            {params.row.activeFlag == 'Y' ? (
                                <ToggleOnIcon
                                    style={{ color: 'green', fontSize: 30 }}
                                    onClick={() => deleteById(params.id, 'N')}
                                />
                            ) : (
                                <ToggleOffIcon
                                    style={{ color: 'red', fontSize: 30 }}
                                    onClick={() => deleteById(params.id, 'Y')}
                                />
                            )}
                        </IconButton>
                    </Box>
                )
            },
        },
    ]

    // Row

    return (
        <ThemeProvider theme={theme}>
            <Paper
                elevation={8}
                variant="outlined"
                sx={{
                    border: 1,
                    borderColor: 'grey.500',
                    marginLeft: '10px',
                    marginRight: '10px',
                    marginTop: '10px',
                    marginBottom: '60px',
                    padding: 1,
                }}
            >
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '10px',
                        // backgroundColor:'#0E4C92'
                        // backgroundColor:'		#0F52BA'
                        // backgroundColor:'		#0F52BA'
                        background:
                            'linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)',
                    }}
                >
                    <h2>
                        {/* Book Type Master */}
                        {<FormattedLabel id="libraryCSCMaster" />}
                    </h2>
                </Box>
                <div>
                    <Typography sx={{ fontWeight: 800, color: 'red', marginLeft: "7vh", marginTop: "2vh", marginBottom: "2vh" }}>
                        {/* <FormattedLabel id="attachmentSchema" /> */}
                        *Note - Library Type must be 1) L(for library)  2) C(for Competitive center)
                    </Typography>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {isOpenCollapse && (
                            <Slide
                                direction="down"
                                in={slideChecked}
                                mountOnEnter
                                unmountOnExit
                            >
                                <Grid container
                                    spacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                                    style={{ marginTop: '1vh', marginLeft: '1vh' }}
                                >

                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <TextField
                                            // label="Book Type"
                                            label={<FormattedLabel id="libraryName" />}
                                            id="standard-basic"
                                            variant="standard"
                                            {...register('libraryName')}
                                            error={!!errors.libraryName}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch('libraryName') ? true : false) ||
                                                    (router.query.libraryName ? true : false),
                                            }}
                                            helperText={
                                                // errors?.studentName ? errors.studentName.message : null
                                                errors?.libraryName ? 'libraryName is Required !!!' : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <TextField
                                            // label="Book Type"
                                            label={<FormattedLabel id="libraryNameMr" />}
                                            id="standard-basic"
                                            variant="standard"
                                            {...register('libraryNameMr')}
                                            error={!!errors.libraryNameMr}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch('libraryNameMr') ? true : false) ||
                                                    (router.query.libraryNameMr ? true : false),
                                            }}
                                            helperText={
                                                // errors?.studentName ? errors.studentName.message : null
                                                errors?.libraryNameMr ? 'libraryNameMr is Required !!!' : null
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <TextField
                                            // label="Book Type"
                                            label={<FormattedLabel id="libraryType" />}
                                            id="standard-basic"
                                            variant="standard"
                                            {...register('libraryType')}
                                            error={!!errors.libraryType}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch('libraryType') ? true : false) ||
                                                    (router.query.libraryType ? true : false),
                                            }}
                                            helperText={
                                                // errors?.studentName ? errors.studentName.message : null
                                                errors?.libraryType ? 'Book Type is Required !!!' : null
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={5}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            paddingTop: '10px',
                                            marginTop: '20px',
                                        }}
                                    >
                                        <Grid item >
                                            <Button
                                                sx={{ marginRight: 8 }}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                endIcon={<SaveIcon />}
                                            >
                                                {/* {btnSaveText === 'Update' ? 'Update' : 'Save'} */}
                                                {<FormattedLabel id={btnSaveText} />}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                sx={{ marginRight: 8 }}
                                                variant="contained"
                                                color="primary"
                                                endIcon={<ClearIcon />}
                                                onClick={() => cancellButton()}
                                            >
                                                {/* clear */}
                                                {<FormattedLabel id="clear" />}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<ExitToAppIcon />}
                                                onClick={() => exitButton()}
                                            >
                                                {/* exit */}
                                                {<FormattedLabel id="exit" />}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {/* </div> */}
                                </Grid>
                            </Slide>
                        )}
                    </form>
                </FormProvider>

                <div className={styles.addbtn}>
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        // type='primary'
                        disabled={buttonInputState}
                        onClick={() => {
                            reset({
                                ...resetValuesExit,
                            })
                            setEditButtonInputState(true)
                            setDeleteButtonState(true)
                            setBtnSaveText('save')
                            setButtonInputState(true)
                            setSlideChecked(true)
                            setIsOpenCollapse(!isOpenCollapse)
                        }}
                    >
                        {/* add */}
                        {<FormattedLabel id="add" />}
                    </Button>
                </div>

                <DataGrid
                    // disableColumnFilter
                    // disableColumnSelector
                    // disableToolbarButton
                    // disableDensitySelector
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                            // printOptions: { disableToolbarButton: true },
                            // disableExport: true,
                            // disableToolbarButton: true,
                            // csvOptions: { disableToolbarButton: true },
                        },
                    }}
                    autoHeight
                    sx={{
                        // marginLeft: 5,
                        // marginRight: 5,
                        // marginTop: 5,
                        // marginBottom: 5,

                        overflowY: 'scroll',

                        '& .MuiDataGrid-virtualScrollerContent': {},
                        '& .MuiDataGrid-columnHeadersInner': {
                            backgroundColor: '#556CD6',
                            color: 'white',
                        },

                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                    }}
                    // rows={dataSource}
                    // columns={columns}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    //checkboxSelection

                    density="compact"
                    // autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    // loading={data.loading}
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    rows={data.rows}
                    columns={columns}
                    onPageChange={(_data) => {
                        getBookClassifications(data.pageSize, _data)
                    }}
                    onPageSizeChange={(_data) => {
                        console.log('222', _data)
                        // updateData("page", 1);
                        getBookClassifications(_data, data.page)
                    }}
                />
            </Paper>
        </ThemeProvider >
    )
}

export default Index
