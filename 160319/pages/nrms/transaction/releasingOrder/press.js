import { Button } from '@mui/material'

import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './press.module.css'
import axios from 'axios'
import urls from '../../../../URLS/urls'
import swal from 'sweetalert'
import moment from 'moment'
import { useSelector } from "react-redux";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = () => {
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const backToHomeButton = () => {
        history.push({ pathname: '/homepage' })
    }
    const [dataa, setDataa] = useState(null)
    const [selectedObject, setSelectedObject] = useState();
    const [work, setWork] = useState();


    //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
    let approvalId = router?.query?.id;
    console.log('service123', approvalId)

    const user = useSelector((state) => state.user.user);

    console.log("user", user);

    // selected menu from drawer

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

    // get authority of selected user

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);

    useEffect(() => {
        // getWard();
        // getAllTableData();
        // getDepartment();
        // getRotationGroup();
        // getRotationSubGroup();
        // getNewsPaper();

        // getDate();
    });;

    useEffect(() => {

        axios
            // .get(
            //   `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
            // )
            // .get(
            //   `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getById?applicationId=${router?.query?.id}`,
            // )
            .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`)
            //   .get(
            //     `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router?.query?.id}&serviceId=${router.query.serviceId}`,
            //   )
            .then((r) => {
                // setDataa(res.data.trnNewsPublishRequestList)
                // console.log('board data', res.data.trnNewsPublishRequestList)
                // dataa && dataa.map((each) => {
                //     if (each.id == approvalId) {
                //       setSelectedObject(each)
                //     }
                //   }


                //   )
                let result = r.data.trnNewsPublishRequestList;
                console.log("getAllTableData", result);
                result && result.map((each) => {
                    if (each.id == approvalId) {
                        setSelectedObject(each)
                    }
                }
                )

            }
            )
    });
    console.log("selectedobject", selectedObject)






    // view
    return (
        <>
            <div>
                <ComponentToPrint selectedObject={selectedObject} ref={componentRef} />
            </div>
            <br />

            <div className={styles.btn}>
            {authority && authority[0] === "RTI_APPEAL_ADHIKARI"? (
                <>
                <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    onClick={handlePrint}
                >
                    print
                </Button>
                <Button
                    type="primary"
                    variant="contained"
                    onClick={() => {
                        swal(
                            'Exit!',
                            'जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया',
                            'success',
                        )
                        const record = selectedObject;

                        router.push({
                            pathname: '/nrms/transaction/pressNoteRelease',
                            query: {
                                pageMode: "View",
                                ...record,

                            },
                        });

                        // router.push(`/nrms/transaction/AdvertisementRotation/view`)
                    }}
                >
                    Exit
                </Button>
                </>):(<>
                    <Button
                            variant="contained"
                            sx={{ size: '23px' }}
                            type="primary"
                            //                    
                            onClick={() => {
                                const record = selectedObject;

                                router.push({
                                    pathname: '/nrms/transaction/pressNoteRelease/approval',
                                    query: {
                                        pageMode: "View",
                                        ...record,
                                      },
                                }); // router.push(`/nrms/transaction/AdvertisementRotation/view`)
                            }}
                        >
                            Exit
                        </Button>
                </>)}

                {authority && authority[0] === "ENTRY" ? ( <>
                     <Button
                     variant="contained"
                     sx={{ size: '23px' }}
                     type="primary"
                     //                    
                     onClick={() => {
                        swal(
                            'Press Note Publish!',
                            // 'जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया',
                            'success',
                        )
                         const record = selectedObject;

                         router.push({
                             pathname: '/nrms/transaction/pressNoteRelease/',
                             query: {
                                 pageMode: "View",
                                 ...record,
                               },
                         }); // router.push(`/nrms/transaction/AdvertisementRotation/view`)
                     }}
                 >
                    Publish
                 </Button>
                </>):(<></>)}
            </div>
        </>
    )
}

class ComponentToPrint extends React.Component {
    render() {
        return (
            <>
                <div className={styles.main}>
                    <div className={styles.small}>
                        <div className={styles.one}>
                            <div className={styles.logo}>
                                <div>
                                    <img src="/logo.png" alt="" height="100vh" width="100vw" />
                                </div>
                            </div>
                            <div
                                className={styles.middle}
                                styles={{ paddingTop: '15vh', marginTop: '20vh' }}
                            >

                                <h1>
                                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                                </h1>
                                <div className={styles.add8}>

                                    <div className={styles.add}>
                                        <h5><b>पिंपरी चिंचवड महानगरपलिका </b></h5>
                                        <h5> <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b></h5>
                                        <h5><b> महाराष्ट्र, भारत</b></h5>
                                    </div>

                                    <div className={styles.add1}>
                                        <h5><b>फोन क्रमांक:91-020-2742-5511/12/13/14</b></h5>
                                        <h5>
                                            <b> इमेल: egov@pcmcindia.gov.in</b>
                                        </h5>
                                        <h5><b>/ sarathi@pcmcindia.gov.in</b></h5>
                                    </div>
                                </div>

                                {/* <div className={styles.foot}>
               
               
                
              </div> */}
                                {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4> */}

                                {/* <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
                            </div>
                            <div className={styles.logo1}>
                                <img
                                    src="/smartCityPCMC.png"
                                    alt=""
                                    height="100vh"
                                    width="100vw"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.heading}>
                                {/* <b>पावती</b> */}
                                <h5>
                                    {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                                </h5>
                            </h2>
                        </div>

                        <div className={styles.two}>
                            {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div >
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{this?.props?.dataa?.payment?.receiptDate}</b>
                  </h4>
                </div>

                <div >
                  <h4>
                    {' '}
                    <b>वेळ :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.dataa?.payment?.receiptTime}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: '40px' }}>
                  {' '}
                  <b>पावती क्रमांक :</b>
                </h4>{' '}
                <h4 style={{ marginLeft: '10px' }}>
                  <b>{this?.props?.dataa?.payment?.receiptNo}</b>
                </h4>
              </div> */}
                            <div className={styles.date4} style={{ marginTop: '2vh' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginRight: '100px' }}>
                                        <b><b>पिंपरी चिंचवड महानगरपलिका </b></b>
                                    </h4>{' '}
                                    <h4 style={{ marginRight: '10px' }}

                                    >
                                        {/* {this?.props?.selectedObject?.id} */}






                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>

                            </div>

                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>
                                            <h4 style={{ marginRight: '110px' }}>
                                                <b><b>माहिती व जनसंपर्क विभाग </b></b>
                                            </h4>{' '} </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        <b>
                                            {' '}
                                            {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                                        </b>{' '}
                                        {/* {this?.props?.dataa?.applicationDate} */}
                                    </h4>
                                </div>
                            </div>

                            {/* subject */}

                            <div className={styles.date5} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date6}>
                                    <h4 style={{ marginLeft: '80px' }}>
                                        {' '}
                                        <b>
                                            जहिरात प्रसिधीबाबात </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        <b>
                                            {' '}
                                            {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                                        </b>{' '}
                                        {/* {this?.props?.dataa?.applicationDate} */}
                                    </h4>
                                </div>
                            </div>


                            {/* 
                           

                          


                            
                          


                            {/* details */}
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <p style={{ marginLeft: '80px' }}>
                                        {' '}

                                        पिंपरी चिंचवड महानगरपालिकेच्या वतीने नव्याने उभारण्यात येत असलेल्या आकुर्डी येथील रुग्णालयाची पाहणी आयुक्त राजेश पाटील यांनी केली. येथील प्रलंबित कामे तातडीने पूर्ण करण्याबाबतचे आदेश त्यांनी अधिका-यांना दिले. <br/>
                                        <br/>
                                        यावेळी अतिरिक्त आयुक्त विकास ढाकणे, शहर अभियंता राजन पाटील, आरोग्य वैद्यकीय अधिकारी डॉ.

                                        अनिल रॉय, मुख्य माहिती व तंत्रज्ञान अधिकारी नीलकंठ पोमण, कार्यकारी अभियंता रवींद्र पवार, थॉमस

                                        नरोना, संजय खाबडे, अनिल शिंदे, माहिती व तंत्रज्ञान अधिकारी अनिता कोटलवार, ज्येष्ठ वैद्यकीय अधिकारी

                                        डॉ. सुजाता साळवे, मुख्य सुरक्षा अधिकारी मेजर उदय जराडे, क्षेत्रीय अधिकारी सुचिता पानसरे आदी उपस्थित

                                        होते.
                                        <br />
                                        <br/>

                                        पिंपरी चिंचवड महानगरपालिका

                                        आकुर्डी गावठाण येथील जागेत १०० खाटांच्या सुसज्ज रुग्णालयाच्या उभारणीचे काम अंतिम टप्प्यात आहे. सुमारे ३९ कोटी रुपये खर्च करून अद्यावत ५ मजली रुग्णालयाची इमारत उभारली जात आहे. याठिकाणी बसविण्यात येणा-या विविध उपकरणे तसेच इतर साहित्य आणि सुविधांची पाहणी आयुक्त राजेश पाटील यांनी केली.
                                    </p>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        <b>
                                            {' '}
                                            {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                                        </b>{' '}
                                        {/* {this?.props?.dataa?.applicationDate} */}
                                    </h4>
                                </div>
                            </div>




                            <div className={styles.date7} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date8}>
                                    <div className={styles.add7}>

                                        <h5><b>सही/-</b></h5>
                                        <h5>

                                            सहाय्यक आयुक्त
                                        </h5>
                                        <h5>
                                            माहिती व जनसंपर्क विभाग
                                        </h5>
                                        <h5>
                                            पिंपरी चिंचवड महानगरपालिका
                                        </h5>
                                        <h5>

                                            पिंपरी ४११ ०१८
                                        </h5>
                                    </div>
                                    <h4 style={{ marginLeft: '10px' }}>
                                        <b>
                                            {' '}
                                            {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                                        </b>{' '}
                                        {/* {this?.props?.dataa?.applicationDate} */}
                                    </h4>
                                </div>
                            </div>





                            {/* details */}







                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Index
