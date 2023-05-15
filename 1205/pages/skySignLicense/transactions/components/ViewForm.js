//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Button, Paper, Stack, ThemeProvider } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import axios from 'axios'
// import BoardDocumentThumbAndSign from '../../../../../components/marriageRegistration/BoardDocumentThumbAndSign'
// import BoardRegistration from '../../transactions/boardRegistrations/citizen/boardRegistration'
// import NewMembershipRegistration from '../citizen/newMembershipRegistration'
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
// import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload"
// import styles from '../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import styles from '../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import theme from "../../../../theme.js";
import urls from '../../../../URLS/urls'
import CloseIcon from '@mui/icons-material/Close'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'


const Index = () => {
    const router = useRouter()
    let user = useSelector((state) => state.user.user)
    const language = useSelector((state) => state?.labels.language)
    const methods = useForm()
    let serviceId = Number(router?.query?.serviceId)
    const [data, setData] = useState()
    const {
        // getValues,
        // register,
        // handleSubmit,
        // control,
        reset,
        setValue,
        formState: { errors },
    } = methods
    //http://localhost:8090/mr/api/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}
    // useEffect(() => {
    //   console.log('router?.query?', router?.query)
    //   if (router?.query?.id) {

    //     // setData(router?.query)
    //     // reset(router?.query)
    //   }
    // }, [])

    // useEffect(() => {
    //   console.log('router?.query?.role', router?.query?.role)
    //   reset(router?.query)
    // }, [])
    const [tempState, setTemp] = useState(false);
    useEffect(() => {
        const ID = router.query?.id

        console.log('router?.query?', router?.query)
        if (ID) {
            setValue('applicationNumber', Number(ID))
            axios
                .get(
                    `${urls.SSLM}/Trn/ApplicantDetails/getByIdAndServicIdAndID?serviceId=${router?.query?.serviceId}&id=${router?.query?.id}`,
                )
                .then((res) => {
                    // setdata(res.data.trnApplicantDetailsDao[0])
                    reset(res.data.trnApplicantDetailsDao[0])
                    setTemp(true);
                    console.log('loi recept data', res.data.trnApplicantDetailsDao[0])
                })
            // .then((resp) => {
            //   console.log('MODOFCER', resp.data)
            //   // setValue("applicationNumber", ID)
            //   reset(resp.data)
            //   // setValue("applicationNumber", ID)

            //   setData(resp.data)
            // })
        }
    }, [])
    useEffect(() => {

    }, [tempState])
    return (
        <>
            {tempState ?
                <ThemeProvider theme={theme}>

                    <Paper
                        sx={{
                            marginLeft: 2,
                            marginRight: 2,
                            marginTop: 1,
                            marginBottom: 1,
                            padding: 1,
                            // borderRadius: 5,
                            border: 1,
                            borderColor: '#5BCAFA',
                        }}
                    >
                        <FormProvider {...methods}>




                            {serviceId === 7 ? (
                                <>

                                    <ApplicantDetails />


                                    {/* <AadharAuthentication /> */}

                                    <AddressOfLicense />

                                    <BusinessOrIndustryInfo />

                                    <IndustryAndEmployeeDetaills />

                                    <PartenershipDetail />

                                    <IndustryDocumentsUpload />

                                </>
                            ) : (
                                ''
                            )}

                            {serviceId === 8 ? (
                                <>
                                    <ApplicantDetails />

                                    <AddressOfLicense />

                                    <BusinessOrIndustryInfo />

                                    <IndustryAndEmployeeDetaills />

                                    <PartenershipDetail />
                                    <IndustryDocumentsUpload />
                                </>
                            ) : (
                                ''
                            )}

                            <Stack
                                spacing={15}
                                direction="row"
                                style={{ display: 'flex', justifyContent: 'center' }}
                            >


                                <Button
                                    variant="contained"
                                    endIcon={<CloseIcon />}
                                    color="error"
                                    onClick={() => {
                                        // alert(serviceId)

                                        router.push(
                                            `/dashboard`,
                                        )

                                    }}
                                >
                                    <FormattedLabel id="exit" />
                                </Button>
                            </Stack>
                        </FormProvider>
                    </Paper>
                </ThemeProvider>
                : ""}
        </>
    )
}

export default Index
