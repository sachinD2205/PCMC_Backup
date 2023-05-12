import BrushIcon from '@mui/icons-material/Brush'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import EventIcon from '@mui/icons-material/Event'
import PaidIcon from '@mui/icons-material/Paid'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import WcIcon from '@mui/icons-material/Wc'
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../styles/marrigeRegistration/[dashboard].module.css'
import urls from '../../../URLS/urls'

// Main Component - Clerk
const Index = () => {
    const router = useRouter()
    const user = useSelector((state) => state?.user.user)
    const language = useSelector((state) => state?.labels.language)
    const [dataSource, setDataSource] = useState([])
    const [serviceList, setServiceList] = useState([])

    const [nmrauthority, setNmrAuthority] = useState([])
    const [mbrauthority, setMbrAuthority] = useState([])
    const [mmcauthority, setMmcAuthority] = useState([])
    const [mmbcauthority, setMmbcAuthority] = useState([])
    const [rmcauthority, setRmcAuthority] = useState([])
    const [rmbcauthority, setRmbcAuthority] = useState([])

    const [pendingApplication, setPendingApplication] = useState(0)
    const [rejectedApplication, setRejectedApplication] = useState(0)
    const [approvedApplication, setApprovedApplication] = useState(0)
    const [totalApplication, setTotalApplication] = useState(0)
    const tempData = [
        {
            id: 1,
            applicationNumber: 12,
            applicationDate: "19/02/2023",
            applicantName: "Sarthak",
            applicationStatus: "APPLICATION_CREATED",
            // startDate: "19-02-2023",
            // endDate: "29-03-2023",
            serviceName: "Issuance of Business License",
            serviceId: 43
        },
        {
            id: 2,
            applicationNumber: 13,
            applicationDate: "19/02/2023",
            applicantName: "Sarthak",
            applicationStatus: "APPLICATION_CREATED",
            // startDate: "19-02-2023",
            // endDate: "04-04-2023",
            serviceName: "Issuance of Store License",
            serviceId: 44
        },
        {
            id: 3,
            applicationNumber: 13,
            applicationDate: "29/02/2023",
            applicantName: "Sarthak",
            applicationStatus: "APPLICATION_CREATED",
            // startDate: "19-02-2023",
            // endDate: "04-04-2023",
            serviceName: "Issuance of Industry License",
            serviceId: 45
        }
    ]
    useEffect(() => {
        let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles
        let rmc = user?.menus?.find((r) => r.serviceId == 11)?.roles
        let mmc = user?.menus?.find((r) => r.serviceId == 12)?.roles
        let rmbc = user?.menus?.find((r) => r.serviceId == 14)?.roles
        let mmbc = user?.menus?.find((r) => r.serviceId == 15)?.roles
        let mbr = user?.menus?.find((r) => r.serviceId == 67)?.roles
        console.log('nmr', nmr)
        console.log('rmc', rmc)
        console.log('mmc', mmc)
        console.log('rmbc', rmbc)
        console.log('mmbc', mmbc)
        console.log('mbr', mbr)
        setNmrAuthority(nmr)
        setRmcAuthority(rmc)
        setMmcAuthority(mmc)
        setRmbcAuthority(rmbc)
        setMmbcAuthority(mmbc)
        setMbrAuthority(mbr)
    }, [user?.menus])

    //
    let nmrcreated = []
    let apptScheduled = []
    let nmrclkVerified = []
    let nmrcmolaKonte = []
    let nmrcmoVerified = []
    let nmrloiGenerated = []
    let nmrpaymentCollected = []
    let nmrcertificateIssued = []
    let nmrcertificateGenerated = []

    //marriage board
    let mbrcreated = []
    let mbrclkVerified = []
    let mbrcmolaKonte = []
    let mbrcmoVerified = []
    let mbrloiGenerated = []
    let mbrpaymentCollected = []
    let mbrcertificateGenerated = []
    let mbrcertificateIssued = []

    //modification of marriage
    let mmccreated = []
    let mmcclkVerified = []
    let mmccmolaKonte = []
    let mmccmoVerified = []
    let mmcloiGenerated = []
    let mmcpaymentCollected = []
    let mmccertificateIssued = []
    let mmccertificateGenerated = []

    //modification of marriage board
    let mmbccreated = []
    let mmbcclkVerified = []
    let mmbccmolaKonte = []
    let mmbccmoVerified = []
    let mmbcloiGenerated = []
    let mmbcpaymentCollected = []
    let mmbccertificateIssued = []
    let mmbccertificateGenerated = []

    //reissue of marriage
    let rmcpaymentCollected = []

    //renewal of marriage board
    let rmbcpaymentCollected = []

    //finalUnsorted datasource
    let finalMerged = []

    const getServiceName = async () => {
        await axios
            .get(`${urls.CFCURL}/master/service/getAll`)
            .then((r) => {
                if (r.status == 200) {
                    setServiceList(r.data.service)
                }
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    const getMyApplications = async () => {
        // axios
        //     // .get(`${urls.MR}/transaction/prime/getDashboardDtl`, {
        //     //   headers: {
        //     //     Authorization: `Bearer ${user.token}`,
        //     //   },
        //     // })
        //     .get(`${urls.LMSURL}/trnApplyForNewMembership/getAllByServiceId?serviceId=${85}`
        //     )
        //     .then((resp) => {
        //         resp?.data?.trnApplyForNewMembershipList
        //             .map((row) => {
        //                 if (
        //                     (nmrauthority.includes('DOCUMENT_CHECKLIST') ||
        //                         nmrauthority.includes('ADMIN')) &&
        //                     row.applicationStatus === 'APPLICATION_CREATED'
        //                 ) {
        //                     nmrcreated = [...nmrcreated, row]
        //                 }
        //                 // if (row.serviceId == 10) {
        //                 //   if (
        //                 //     (nmrauthority.includes('DOCUMENT_CHECKLIST') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_CREATED'
        //                 //   ) {
        //                 //     nmrcreated = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('APPOINTMENT_SCHEDULE') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK'
        //                 //   ) {
        //                 //     nmrclkVerified = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('DOCUMENT_VERIFICATION') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPOINTMENT_SCHEDULED'
        //                 //   ) {
        //                 //     apptScheduled = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('FINAL_APPROVAL') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_CMO'
        //                 //   ) {
        //                 //     nmrcmolaKonte = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('LOI_GENERATION') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'CMO_APPROVED'
        //                 //   ) {
        //                 //     nmrcmoVerified = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('CASHIER') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'LOI_GENERATED'
        //                 //   ) {
        //                 //     nmrloiGenerated = [row]
        //                 //   } else if (
        //                 //     (nmrauthority.includes('CERTIFICATE_ISSUER') ||
        //                 //       nmrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     nmrpaymentCollected = [row]
        //                 //   }
        //                 // } else if (row.serviceId == 11) {
        //                 //   if (
        //                 //     (rmcauthority.includes('CASHIER') ||
        //                 //       rmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     rmcpaymentCollected = [row]
        //                 //   }
        //                 // } else if (row.serviceId == 12) {
        //                 //   if (
        //                 //     (mmcauthority.includes('DOCUMENT_CHECKLIST') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_CREATED'
        //                 //   ) {
        //                 //     mmccreated = [row]
        //                 //   } else if (
        //                 //     (mmcauthority.includes('DOCUMENT_VERIFICATION') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK'
        //                 //   ) {
        //                 //     mmcclkVerified = [row]
        //                 //   } else if (
        //                 //     (mmcauthority.includes('FINAL_APPROVAL') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_CMO'
        //                 //   ) {
        //                 //     mmccmolaKonte = [row]
        //                 //   } else if (
        //                 //     (mmcauthority.includes('LOI_GENERATION') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'CMO_APPROVED'
        //                 //   ) {
        //                 //     mmccmoVerified = [row]
        //                 //   } else if (
        //                 //     (mmcauthority.includes('CASHIER') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'LOI_GENERATED'
        //                 //   ) {
        //                 //     mmcloiGenerated = [row]
        //                 //   } else if (
        //                 //     (mmcauthority.includes('CERTIFICATE_ISSUER') ||
        //                 //       mmcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     mmcpaymentCollected = [row]
        //                 //   }
        //                 // } else if (row.serviceId == 14) {
        //                 //   if (
        //                 //     (rmbcauthority.includes('CASHIER') ||
        //                 //       rmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     rmbcpaymentCollected = [row]
        //                 //   }
        //                 // } else if (row.serviceId == 15) {
        //                 //   if (
        //                 //     (mmbcauthority.includes('DOCUMENT_CHECKLIST') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_CREATED'
        //                 //   ) {
        //                 //     mmbccreated = [row]
        //                 //   } else if (
        //                 //     (mmbcauthority.includes('DOCUMENT_VERIFICATION') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK'
        //                 //   ) {
        //                 //     mmbcclkVerified = [row]
        //                 //   } else if (
        //                 //     (mmbcauthority.includes('FINAL_APPROVAL') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_CMO'
        //                 //   ) {
        //                 //     mmbccmolaKonte = [row]
        //                 //   } else if (
        //                 //     (mmbcauthority.includes('LOI_GENERATION') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'CMO_APPROVED'
        //                 //   ) {
        //                 //     mmbccmoVerified = [row]
        //                 //   } else if (
        //                 //     (mmbcauthority.includes('CASHIER') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'LOI_GENERATED'
        //                 //   ) {
        //                 //     mmbcloiGenerated = [row]
        //                 //   } else if (
        //                 //     (mmbcauthority.includes('CERTIFICATE_ISSUER') ||
        //                 //       mmbcauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     mmbcpaymentCollected = [row]
        //                 //   }
        //                 // } else if (row.serviceId == 67) {
        //                 //   if (
        //                 //     (mbrauthority.includes('DOCUMENT_CHECKLIST') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_CREATED'
        //                 //   ) {
        //                 //     mbrcreated = [row]
        //                 //   } else if (
        //                 //     (mbrauthority.includes('DOCUMENT_VERIFICATION') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK'
        //                 //   ) {
        //                 //     mbrclkVerified = [row]
        //                 //   } else if (
        //                 //     (mbrauthority.includes('FINAL_APPROVAL') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'APPLICATION_SENT_TO_CMO'
        //                 //   ) {
        //                 //     mbrcmolaKonte = [row]
        //                 //   } else if (
        //                 //     (mbrauthority.includes('LOI_GENERATION') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'CMO_APPROVED'
        //                 //   ) {
        //                 //     mbrcmoVerified = [row]
        //                 //   } else if (
        //                 //     (mbrauthority.includes('CASHIER') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'LOI_GENERATED'
        //                 //   ) {
        //                 //     mbrloiGenerated = [row]
        //                 //   } else if (
        //                 //     (mbrauthority.includes('CERTIFICATE_ISSUER') ||
        //                 //       mbrauthority.includes('ADMIN')) &&
        //                 //     row.applicationStatus === 'PAYEMENT_SUCCESSFULL'
        //                 //   ) {
        //                 //     mbrpaymentCollected = [row]
        //                 //   }
        //                 // }
        //             })

        //         finalMerged = [
        //             ...nmrcreated,
        //             // ...apptScheduled,
        //             // ...nmrclkVerified,
        //             // ...nmrcmolaKonte,
        //             // ...nmrcmoVerified,
        //             // ...nmrloiGenerated,
        //             // ...nmrpaymentCollected,
        //             // ...nmrcertificateIssued,
        //             // ...nmrcertificateGenerated,

        //             // ...mmccreated,
        //             // ...mmcclkVerified,
        //             // ...mmccmolaKonte,
        //             // ...mmccmoVerified,
        //             // ...mmcloiGenerated,
        //             // ...mmcpaymentCollected,
        //             // ...mmccertificateIssued,
        //             // ...mmbccertificateGenerated,

        //             // ...mbrcreated,
        //             // ...mbrclkVerified,
        //             // ...mbrcmolaKonte,
        //             // ...mbrcmoVerified,
        //             // ...mbrloiGenerated,
        //             // ...mbrpaymentCollected,
        //             // ...mbrcertificateIssued,
        //             // ...mbrcertificateGenerated,

        //             // ...mmbccreated,
        //             // ...mmbcclkVerified,
        //             // ...mmbccmolaKonte,
        //             // ...mmbccmoVerified,
        //             // ...mmbcloiGenerated,
        //             // ...mmbcpaymentCollected,
        //             // ...mmbccertificateIssued,
        //             // ...mmbccertificateGenerated,

        //             // ...rmcpaymentCollected,

        //             // ...rmbcpaymentCollected,
        //         ]

        //         let sorted = finalMerged.sort((a, b) =>
        //             b.applicationDate > a.applicationDate
        //                 ? 1
        //                 : a.applicationDate > b.applicationDate
        //                     ? -1
        //                     : 0,
        //         )

        //         console.log('finalMerged', sorted)
        //         setDataSource(
        //             sorted.map((r, i) => {
        //                 return {
        //                     srNo: i + 1,
        //                     ...r,
        //                     id: r.id,
        //                     serviceName: serviceList.find((s) => s.id == r.serviceId)
        //                         ?.serviceName,
        //                     serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
        //                         ?.serviceNameMr,
        //                 }
        //             }),
        //         )
        //     })

        axios
            .get(`${urls.SSLM}/Trn/ApplicantDetails/getApplicantDetails`
            )
            .then((resp) => {
                console.log("resp.data", resp.data);
            }
            )
        // setDataSource(
        //     tempData.map((r, i) => {
        //         return {
        //             srNo: i + 1,
        //             ...r,
        //         }
        //     }),
        // )
    }

    useEffect(() => {
        getServiceName()
        getMyApplications()
    }, [])

    useEffect(() => {
        getMyApplications()
    }, [serviceList])

    useEffect(() => {
        setTotalApplication(dataSource.length)
        setPendingApplication(dataSource.length)
    }, [dataSource])

    // Columns
    const columns = [
        {
            field: 'srNo',
            headerAlign: 'center',
            align: 'center',
            headerName: <FormattedLabel id="srNo" />,
            // headerName: "Sr No.",
            width: 90,
        },
        {
            field: 'id',
            headerAlign: 'center',
            align: 'left',
            headerName: <FormattedLabel id="applicationNo" />,
            // headerName: "Application No",
            width: 270,
        },
        {
            field: language == 'en' ? 'serviceName' : 'serviceNameMr',
            headerAlign: 'center',
            align: 'left',
            headerName: <FormattedLabel id="serviceNames" />,
            // headerName: "Service Name",
            width: 290,
        },
        {
            field: 'applicationDate',
            headerAlign: 'center',
            align: 'center',
            headerName: <FormattedLabel id="applicationDate" />,
            // headerName: "Application Date",
            width: 130,
            // valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
        },

        {
            field: language == 'en' ? 'applicantName' : 'applicantNameMr',
            headerAlign: 'center',
            align: 'left',
            headerName: <FormattedLabel id="applicantName" />,
            // headerName: "Applicant Name",
            width: 270,
        },

        {
            field: 'applicationStatus',
            headerAlign: 'center',
            align: 'left',
            headerName: <FormattedLabel id="applicationStatus" />,
            // headerName: "Application Status",
            width: 280,
        },
    ]

    return (
        <>
            <div>
                <Paper
                    component={Box}
                    squar="true"
                    elevation={5}
                    m={1}
                    pt={2}
                    pb={2}
                    pr={2}
                    pl={4}
                >
                    <Grid container>
                        {/** Applications Tabs */}
                        <Grid item xs={12}>
                            <h2 style={{ textAlign: 'center', color: '#ff0000' }}>
                                <b>
                                    {language == 'en'
                                        ? 'Sky Sign and Industrial License'
                                        : 'आकाश चिन्ह आणि औद्योगिक परवाना'}
                                </b>
                            </h2>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                sx={{ height: '160px' }}
                                component={Box}
                                p={2}
                                m={2}
                                squar="true"
                                elevation={5}
                            // sx={{ align: "center" }}
                            >
                                <div className={styles.test}>
                                    {/** Total Application */}
                                    <div
                                        className={styles.one}
                                    // onClick={() => clerkTabClick('TotalApplications')}
                                    >
                                        <div className={styles.icono}>
                                            <WcIcon color="secondary" />
                                        </div>
                                        <br />
                                        <div className={styles.icono}>
                                            <strong align="center">
                                                {language == 'en' ? 'Total Application' : 'एकूण अर्ज'}
                                            </strong>
                                        </div>
                                        <Typography variant="h6" align="center" color="secondary">
                                            {totalApplication}
                                        </Typography>
                                    </div>

                                    {/** Vertical Line */}
                                    <div className={styles.jugaad}></div>

                                    {/** Approved Application */}
                                    <div
                                        className={styles.one}
                                    // onClick={() => clerkTabClick('APPROVED')}
                                    >
                                        <div className={styles.icono}>
                                            <ThumbUpAltIcon color="success" />
                                        </div>
                                        <br />
                                        <div className={styles.icono}>
                                            <strong align="center">
                                                {language == 'en'
                                                    ? 'Approved Application'
                                                    : 'मंजूर अर्ज'}
                                            </strong>
                                        </div>
                                        <Typography variant="h6" align="center" color="green">
                                            {approvedApplication}
                                        </Typography>
                                    </div>

                                    {/** Vertical Line */}
                                    <div className={styles.jugaad}></div>

                                    {/** Pending Applications */}
                                    <div
                                        className={styles.one}
                                    // onClick={() => clerkTabClick('PENDING')}
                                    >
                                        <div className={styles.icono}>
                                            <PendingActionsIcon color="warning" />
                                        </div>
                                        <br />
                                        <div className={styles.icono}>
                                            <strong align="center">
                                                {language == 'en'
                                                    ? 'Pending Application'
                                                    : 'प्रलंबित अर्ज'}
                                            </strong>
                                        </div>
                                        <Typography variant="h6" align="center" color="orange">
                                            {pendingApplication}
                                        </Typography>
                                    </div>

                                    {/** Vertical Line */}
                                    <div className={styles.jugaad}></div>

                                    {/** Rejected Application */}
                                    <div
                                        className={styles.one}
                                    // onClick={() => clerkTabClick('REJECTED')}
                                    >
                                        <div className={styles.icono}>
                                            <CancelIcon color="error" />
                                        </div>
                                        <br />
                                        <div className={styles.icono}>
                                            <strong align="center">
                                                {language == 'en'
                                                    ? 'Rejected Application'
                                                    : 'नाकारलेले अर्ज'}
                                            </strong>
                                        </div>
                                        <Typography variant="h6" align="center" color="error">
                                            {rejectedApplication}
                                        </Typography>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </div>

            <Box
                style={{
                    backgroundColor: 'white',
                    height: 'auto',
                    width: 'auto',
                    overflow: 'auto',
                }}
            >
                <DataGrid
                    getRowId={(row) => row.srNo}
                    sx={{
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                        '& .MuiDataGrid-virtualScrollerContent': {},
                        '& .MuiDataGrid-columnHeadersInner': {
                            backgroundColor: '#556CD6',
                            color: 'white',
                        },

                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                    }}
                    autoHeight
                    scrollbarSize={17}
                    rows={dataSource}
                    columns={columns}
                    pageSize={7}
                    rowsPerPageOptions={[7]}
                />
            </Box>
        </>
    )
}

export default Index
