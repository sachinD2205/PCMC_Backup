import { Button } from '@mui/material'

import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './goshwara.module.css'
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
    useEffect(() => {


    });;

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
    return (
        <>


            <div>
                <ComponentToPrint selectedObject={selectedObject} ref={componentRef} />
            </div>
            <br />


            <div className={styles.btn}>
                {authority && authority[0] === "RTI_APPEAL_ADHIKARI" ? (
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


                                router.push({
                                    pathname: '/nrms/transaction/AdvertisementRotation',


                                });

                                // router.push(`/nrms/transaction/AdvertisementRotation/view`)
                            }}
                        >
                            Exit
                        </Button>

                    </>) :
                    

                    (<>
                    


                        <Button
                            variant="contained"
                            sx={{ size: '23px' }}
                            type="primary"
                            //                    
                            onClick={() => {
                                const record = selectedObject;

                                router.push({
                                    pathname: '/nrms/transaction/AdvertisementRotation/view',
                                    query: {
                                        pageMode: "View",
                                        ...record,
                                      },
                                }); // router.push(`/nrms/transaction/AdvertisementRotation/view`)
                            }}
                        >
                            Exit
                        </Button>
                    </>
                    )
                }
                 {authority && authority[0] === "ENTRY" ? ( <>
                     <Button
                     variant="contained"
                     sx={{ size: '23px' }}
                     type="primary"
                     //                    
                     onClick={() => {
                        swal(
                            'News Publish!',
                            // 'जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया',
                            'success',
                        )
                         const record = selectedObject;

                         router.push({
                             pathname: '/nrms/transaction/AdvertisementRotation/',
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
                                    <h4 style={{ marginLeft: '40px' }}>
                                        <b>प्रति</b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

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
                                            मा. जहिरात व्‍यवस्‍थापक </b>
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
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>
                                            विषय- जहिरात प्रसिधीबाबात </b>
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
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>अर्जदाराचे नाव : </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        {' ' +
                                            this?.props?.dataa?.afNameMr +
                                            ' ' +
                                            this?.props?.dataa?.alNameMr}
                                    </h4>
                                </div>
                            </div> */}

                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '60px' }}>
                                        {' '}
                                        <b>
                                            महोदय, </b>
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


                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <p style={{ marginLeft: '80px' }}>
                                        {' '}

                                        पिंपरी चिंचवड महानगरपालिकेकडील खालील जाहिरात आपल्या वर्तमानपत्रात प्रसिद्ध

                                        करण्यात यावी.
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

                            <div className={styles.date4} style={{ marginTop: '' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginLeft: '90px' }}>
                                        <ul>
                                            <li>

                                                <b> जाहिरात क्र :</b>

                                            </li>
                                        </ul>

                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {this?.props?.selectedObject?.id}






                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>


                            </div>

                            {/* department name */}
                            <div className={styles.date4} style={{ marginTop: '' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginLeft: '90px' }}>
                                        <ul>
                                            <li>

                                                <b> विभागाचे नाव :</b>

                                            </li>
                                        </ul>

                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {this?.props?.selectedObject?.departmentName}






                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>

                                {/* department name */}

                            </div>


                            <div className={styles.date4} style={{ marginTop: '' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginLeft: '90px' }}>
                                        <ul>
                                            <li>

                                                <b> कामाचा तपशिल :</b>

                                            </li>
                                        </ul>

                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {this?.props?.selectedObject?.newsAdvertisementSubject}

                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>

                                {/* department name */}

                            </div>

                            <div className={styles.date4} style={{ marginTop: '' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginLeft: '90px' }}>
                                        <ul>
                                            <li>

                                                <b> प्रसिध्दी तारीख :</b>
                                            </li>
                                        </ul>



                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {this?.props?.selectedObject?.toDate}
                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>

                                {/* department name */}

                            </div>

                            <div className={styles.date4} style={{ marginTop: '' }}>
                                <div className={styles.date3}>
                                    <h4 style={{ marginLeft: '90px' }}>
                                        <ul>
                                            <li>

                                                <b> प्रसिध्दीचा स्तर:</b>
                                            </li>
                                        </ul>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {this?.props?.selectedObject?.newsPaperLevel}

                                    </h4>



                                </div>


                            </div>


                            {/* details */}
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <p style={{ marginLeft: '80px' }}>
                                        {' '}

                                        तरी उपरोक्त प्रमाणे सदरची जाहिरात कमीत कमी आकारमानात प्रसिद्ध करावी.
                                        जाहिरात बिलाची अदायगी जाहिरात
                                        रोटेशन धोरण सन २०१९-२० नुसार करण्यात येईल. तसेच सदर जाहिरातीचे बिल सहाय्यक आयुक्त, माहिती व जनसंपर्क विभाग, पिंपरी चिंचवड महानगरपलिका यांच्या नावे दोन प्रतीमध्ये माहिती व जनसंपर्क विभागात जाहिरात प्रसिद्धी दिनांकापासून १५ दिवसाचे आत सादर करावे
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
