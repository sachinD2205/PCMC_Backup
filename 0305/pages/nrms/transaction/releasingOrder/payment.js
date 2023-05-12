import { Button } from '@mui/material'

import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './payment.module.css'
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

        axios
            // .get(
            //   `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
            // )
            // .get(
            //   `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getById?applicationId=${router?.query?.id}`,
            // )
            .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`)
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
                let result = r.data.trnNewspaperAgencyBillSubmissionList;
                console.log("getAllTableData", result);
                result && result.map((each) => {
                    if (each.id == approvalId) {
                        setSelectedObject(each)
                    }
                }
                )

            }
            )
    }, []);
    console.log("ddddd", selectedObject)
    return (
        <>
            <div>
                <ComponentToPrint selectedObject={selectedObject} ref={componentRef} />
            </div>
            <br />
            <div className={styles.btn} >
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
                {authority && authority[0] === "ENTRY" ? (<>
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
                </>) : (<></>)}

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
                                        <b>वाचले -</b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}

                                    >
                                        {/* {this?.props?.selectedObject?.id} */}
                                    </h4>
                                    {/* {console.log("XCV",priority)} */}


                                </div>
                            </div>

                            <div>
                                <ol>

                                    <li> माजसं/2/कावि/358/2019 दि. 13/08/2019 रोजीचे जाहिरात रोटेशन धोरणाचे परिपत्रक.</li>
                                    <li> माजसं/2/कावि/1/2020 दि. 01/01/2020 रोजीचे जाहिरात सेल स्थापनेबाबतचे परिपत्रक.</li>
                                    <li>मध्यवर्ती भांडार विभागाकडील पत्र क्र.मभां/ 15/कावि/41/2021 दिनांक 10/02/2021 अन्वये मा. माहिती व जनसंपर्क विभाग यांना जाहिरात प्रसिद्ध करणेकामी पत्र.</li>
                                    <li>मा. माहिती व जनसंपर्क विभाग यांचे क्र.माजसं / 2 /कावि/ 56 / 2021 दिनांक 28/01/2021 चे दै. सकाळ, दै. आज का आनंद चे जाहिरात व्यवस्थापक यांना दिलेले पत्र.</li>
                                    <li>दै. सकाळ, दै. आज का आनंद यांचे अनुक्रमे बिल क्रमांक 20001030727, 12-02-2021 | ADVTFEB104/2021, 12-02-2021 अन्वये जाहिरातचे बिल सादर
                                        97</li>
                                    <li>मा. माहिती व जनसंपर्क विभाग यांचा दिनांक- / / 2021 रोजीचा मान्य प्रस्ताव.</li>
                                </ol>
                            </div>

                            {/* horizontal line */}
                            <div>
                                <h2 className={styles.heading}>
                                    {/* <b>पावती</b> */}
                                    <h5>
                                        {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                                    </h5>
                                </h2>
                            </div>

                            <div className={styles.date7} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date8}>
                                    <div className={styles.add7}>

                                        <h3><b>पिंपरी चिंचवड महानगरपालिका, पिंपरी-411018/-</b></h3>
                                        <h4>

                                            माहिती व जनसंपर्क विभाग,
                                        </h4>
                                        <h4>
                                            क्र.माजसं /5/कावि/391 / 2021
                                        </h4>
                                        <h4>
                                            दिनांक-
                                            {/* {this?.props?.selectedObject?.createDtTm.split("T")[0]} */}
                                            {moment(this?.props?.selectedObject?.createDtTm, "YYYY-MM-DD").format("DD-MM-YYYY")}

                                        </h4>

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




                            {/* subject */}

                            <div className={styles.date8} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date6}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>
                                            विषय-
                                        </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        <b>
                                            {this?.props?.selectedObject?.departmentName} विभागाकडील निविदा नोटीस क्र.46/2020-21 चे शुद्धीपत्रक क्र.1 चे जाहिरात प्रसिध्दीचे बिल अदा करणेबाबत. जाहिरात क्रमांक  {this?.props?.selectedObject?.id} दै. {this?.props?.selectedObject?.newspaperName}
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
                                            आदेश, </b>
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

                                        पिंपरी चिंचवड महानगरपालिकेच्या  {this?.props?.selectedObject?.departmentName} विभागाकडील निविदा नोटीस क्र. 46 / 2020-21 चे शुद्धीपत्रक क्र.1 संबंधित जाहिरात प्रसिध्द करणेकामी मध्यवर्ती भांडार विभाग यांनी उपरोक्त वाचले क्रमांक 3 अन्वये जाहिरात प्रसिध्द करणेकामी पत्र दिले आहे. त्यास अनुसरुन माहिती व जनसंपर्क विभाग यांनी वाचले क्रमांक 4 अन्वये दिनांक {this?.props?.selectedObject?.createDtTm} रोजी जाहिरात प्रसिध्द करण्याबाबत दै.  {this?.props?.selectedObject?.newspaperName} या वर्तमानपत्राचे जाहिरात व्यवस्थापक यांना कळविले आहे. संबंधित वर्तमानपत्र यांनी जाहिरात राज्य स्तरावर प्रसिध्द करुन वाचले क्रमांक 5 अन्वये बिल सादर केले आहे.
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

                            <div className={styles.date9} style={{ marginTop: '' }}>
                                <div className={styles.date10}>
                                    <table className={styles.table}>
                                        <tr className={styles.heading}>
                                            <th className={styles.h1}>अ.क्रं. </th>
                                            <th>वर्तमान पत्राचे नांव / बिल अदा करणार ते नाव</th>
                                            <th>प्रसिद्धी दिनांक</th>
                                            <th>जाहिरात चौ.से.मी. आकारमान</th>
                                            <th>मंजूर दर प्र. से.मी.</th>
                                            <th>एकुण र.रू.</th>
                                            <th>निव्वळ देव र. रू.</th>
                                        </tr>
                                        <tr className={styles.row}>
                                            <td>1</td>
                                            <td> {this?.props?.selectedObject?.newspaperName}</td>

                                            {/* <td> {this?.props?.selectedObject?.createDtTm.split("T")[0]}</td> */}
                                            <td> {moment(this?.props?.selectedObject?.newsAdvertismentPublishedDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</td>
                                            <td> {this?.props?.selectedObject?.newsPublishedInSqMeter}</td>
                                            <td>Rs. 2100/</td>
                                            <td>Rs.  {this?.props?.selectedObject?.billAmount}/</td>
                                            <td> Rs. {this?.props?.selectedObject?.billAmount}/</td>
                                        </tr>
                                    </table>
                                    {/* {console.log("XCV",priority)} */}
                                </div>
                            </div>



                            {/* details */}
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <p style={{ marginLeft: '80px' }}>
                                        {' '}
                                        उपरोक्त नमुद केल्याप्रमाणे विल प्राप्त झाले असून दै.  {this?.props?.selectedObject?.newspaperName} या वर्तमानपत्राने जाहिरात  {this?.props?.selectedObject?.newsPublishedInSqMeter} चौ.से.मी. या कमीत कमी आकारमानात प्रसिध्द केलेली आहे. रोटेशन धोरण परिपत्रक वाचले क्र.2 नुसार बिल अदा करणे आवश्यक आहे. सबब, मी सहाय्यक आयुक्त, माहिती व जनसंपर्क विभाग, पिंपरी चिंचवड महानगरपालिका, पिंपरी- 411018, उक्त तक्यात नमुद केल्याप्रमाणे नियमानुसार कपाती करून प्रदानार्थ मंजूर रक्कम रु.{this?.props?.selectedObject?.billAmount}/- यामधुन बजा दंड रक्कम रु.0/- व 1.5% आयकर रक्कम रु.1440/- कपात करुन उर्वरित रक्कम रु.{this?.props?.selectedObject?.billAmount}/-  अदा करण्यास या आदेशान्वये मान्यता देत आहे.
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
