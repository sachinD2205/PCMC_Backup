import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import NextPlanIcon from '@mui/icons-material/NextPlan'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import UndoIcon from '@mui/icons-material/Undo'
import ReportIcon from '@mui/icons-material/Report'
import {
    Button,
    IconButton,
    Modal,
    Stack,
    TextareaAutosize,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import styles from '../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import urls from '../../URLS/urls'
// import scrutinyActionSchema from './schema/scrutinyActionSchema'

const Index = (props) => {
    const router = useRouter()
    let user = useSelector((state) => state.user.user)
    const [modalforAprov, setmodalforAprov] = useState(false)
    // const [remark, setRemark] = useState(null)

    let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
    // let serviceId = (serviceId = user?.menus?.find(
    //     (m) => m?.id == selectedMenuFromDrawer,
    // )?.serviceId)
    let serviceId = router?.query?.serviceId

    useEffect(() => {
        console.log('selectedMenuFromDrawer:-->', selectedMenuFromDrawer)
        console.log('serviceId', serviceId)
        console.log(router.query.serviceId, '123456')

        if (router?.query?.remark) {
            setValue('remark', '')
        }
    }, [])

    const methods = useFormContext({
        criteriaMode: 'all',
        // resolver: yupResolver(scrutinyActionSchema),
        mode: 'onChange',
    })

    const {
        control,
        register,
        reset,
        getValues,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = methods

    //aprovel
    const remarks = async (props) => {
        // e.preventDefault();

        let applicationId
        if (router?.query?.applicationId) {
            applicationId = router?.query?.applicationId
        } else if (router?.query?.id) {
            applicationId = router?.query?.id
        }

        const finalBody = {
            id: Number(applicationId),
            // isApprove: true,
            remark: watch('remark'),
            role: router.query.role,
            action: props,
        }
        console.log("finalbody", finalBody)
        if (serviceId == 7) {
            axios
                .post(
                    `${urls.SSLM}/Trn/ApplicantDetails/saveApplicationApprove`, finalBody
                )
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        router.push(
                            `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                        )
                    }
                })
                .catch((err) => {
                    swal('Error!', 'Somethings Wrong!', 'error')
                })
        } else if (serviceId == 8) {
            console.log('123456', finalBody)
            axios
                .post(
                    `${urls.SSLM}/Trn/ApplicantDetails/saveApplicationApprove`, finalBody
                )
                .then((response) => {
                    if (response.status === 200 || response.status == 201) {
                        router.push(
                            `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                        )
                    }
                })
                .catch((err) => {
                    swal('Error!', 'Somethings Wrong!', 'error')
                })
        }
    }

    return (
        <>
            <div className={styles.apprve} style={{ marginTop: '25px' }}></div>

            <Stack
                spacing={15}
                direction="row"
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Button
                    variant="contained"
                    endIcon={<NextPlanIcon />}
                    color="success"
                    onClick={() => {
                        // alert(serviceId)
                        setmodalforAprov(true)
                    }}
                >
                    <FormattedLabel id="actions" />
                </Button>

                <Button
                    variant="contained"
                    endIcon={<CloseIcon />}
                    color="error"
                    onClick={() => {
                        // alert(serviceId)
                        if (serviceId == 6) {
                            router.push(
                                `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                            )
                        } else if (serviceId == 7) {
                            router.push(
                                `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                            )
                        }
                        else if (serviceId == 8) {
                            router.push(
                                `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                            )
                        }
                        else if (serviceId == 9) {
                            router.push(
                                `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                            )
                        }
                    }}
                >
                    <FormattedLabel id="exit" />
                </Button>
            </Stack>
            <form {...methods} onSubmit={handleSubmit('remarks')}>
                <div className={styles.model}>
                    <Modal
                        open={modalforAprov}
                        //onClose={clerkApproved}
                        onCancel={() => {
                            setmodalforAprov(false)
                        }}
                    >
                        <div className={styles.boxRemark}>
                            <div className={styles.titlemodelremarkAprove}>
                                <Typography
                                    className={styles.titleOne}
                                    variant="h6"
                                    component="h2"
                                    color="#f7f8fa"
                                    style={{ marginLeft: '25px' }}
                                >
                                    <FormattedLabel id="remarkModel" />
                                    {/* Enter Remark on application */}
                                </Typography>
                                <IconButton>
                                    <CloseIcon
                                        onClick={() => {
                                            // alert(serviceId)
                                            if (serviceId == 6) {
                                                router.push(
                                                    `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                                                )
                                            } else if (serviceId == 7) {
                                                router.push(
                                                    `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                                                )
                                            }
                                            else if (serviceId == 8) {
                                                router.push(
                                                    `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                                                )
                                            }
                                            else if (serviceId == 9) {
                                                router.push(
                                                    `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                                                )
                                            }
                                        }
                                        }
                                    />
                                </IconButton>
                            </div>

                            <div className={styles.btndate} style={{ marginLeft: '200px' }}>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={4}
                                    placeholder="Enter a Remarks"
                                    style={{ width: 700 }}
                                    // onChange={(e) => {
                                    //   setRemark(e.target.value)
                                    // }}
                                    // name="remark"
                                    {...register('remark')}
                                />
                            </div>

                            <div className={styles.btnappr}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    endIcon={<ThumbUpIcon />}
                                    onClick={async () => {
                                        remarks('APPROVE')
                                        // setBtnSaveText('APPROVED')
                                        // alert(serviceId)
                                        // if (serviceId == 6) {
                                        //     router.push(
                                        //         `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                                        //     )
                                        // } else if (serviceId == 7) {
                                        //     router.push(
                                        //         `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                                        //     )
                                        // }
                                        // else if (serviceId == 8) {
                                        //     router.push(
                                        //         `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                                        //     )
                                        // }
                                        // else if (serviceId == 9) {
                                        //     router.push(
                                        //         `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                                        //     )
                                        // }
                                    }}
                                >
                                    <FormattedLabel id="APPROVE" />
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<UndoIcon />}
                                    onClick={() => {
                                        remarks('REASSIGN')
                                        // alert(serviceId, 'REASSIGN')
                                        if (serviceId == 6) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                                            )
                                        } else if (serviceId == 7) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                                            )
                                        }
                                        else if (serviceId == 8) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                                            )
                                        }
                                        else if (serviceId == 9) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                                            )
                                        }
                                    }}
                                >
                                    <FormattedLabel id="REASSIGN" />
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    endIcon={<ReportIcon />}
                                    onClick={() => {
                                        remarks('REJECT')
                                        if (serviceId == 6) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                                            )
                                        } else if (serviceId == 7) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                                            )
                                        }
                                        else if (serviceId == 8) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                                            )
                                        }
                                        else if (serviceId == 9) {
                                            router.push(
                                                `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                                            )
                                        }
                                    }}
                                >
                                    <FormattedLabel id="reject" />
                                </Button>

                                <Button
                                    variant="contained"
                                    endIcon={<CloseIcon />}
                                    color="error"
                                    onClick={() => {
                                        swal({
                                            title: 'Exit?',
                                            text: 'Are you sure you want to exit this Record ? ',
                                            icon: 'warning',
                                            buttons: true,
                                            dangerMode: true,
                                        }).then((willDelete) => {
                                            if (willDelete) {
                                                swal('Record is Successfully Exit!', {
                                                    icon: 'success',
                                                })
                                                if (serviceId == 6) {
                                                    router.push(
                                                        `/skySignLicense/transactions/issuanceOfLicenseSkySign/scrutiny`,
                                                    )
                                                } else if (serviceId == 7) {
                                                    router.push(
                                                        `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`,
                                                    )
                                                }
                                                else if (serviceId == 8) {
                                                    router.push(
                                                        `/skySignLicense/transactions/issuanceOfIndustry/scrutiny`,
                                                    )
                                                }
                                                else if (serviceId == 9) {
                                                    router.push(
                                                        `/skySignLicense/transactions/issuanceOfStore/scrutiny`,
                                                    )
                                                }
                                            } else {
                                                swal('Record is Safe')
                                            }
                                        })
                                    }}
                                >
                                    <FormattedLabel id="exit" />
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </form>
        </>
    )
}
export default Index
