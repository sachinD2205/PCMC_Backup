import { Button } from '@mui/material'

import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './goshwara.module.css'
import axios from 'axios'
import swal from 'sweetalert'
// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
import urls from '../../../../../../URLS/urls'
import moment from 'moment'

const Index = () => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }
  const [dataa, setDataa] = useState(null)

  useEffect(() => {
    axios
      .get(
        `${urls.LMSURL}/trnRenewalOfMembership/getByIdAndServiceId?id=${router?.query?.id}&serviceId=${90}`,
      )
      .then((res) => {
        setDataa(res.data)
        getLibraryName(res.data.zoneKey, res.data.libraryKey)
        // console.log('board data', res.data)
      })
  }, [])

  const [libraryName, setLibraryName] = useState()

  const getLibraryName = (zoneKey, libraryKey) => {
    if (zoneKey) {
      axios
        .get(
          `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${zoneKey}`,
        )
        .then((r) => {
          // setLibraryKeys(
          //   r.data.libraryMasterList.map((row) => ({
          //     id: row.id,
          //     // zoneName: row.zoneName,
          //     // zoneNameMr: row.zoneNameMr,
          //     libraryName: row.libraryName,
          //   })),

          let tempName = r.data?.libraryMasterList?.find((r, i) => r.id == libraryKey).libraryName
          console.log(tempName, "tempName")
          setLibraryName(tempName)
          // )
        })
    }
  }
  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} libraryName={libraryName} />
      </div>
      <br />

      <div className={styles.btn}>
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
                if (router.query.applicationSide == "Citizen") {
                  router.push({
                    pathname: `/dashboard`,
                  })
                } else {
                  router.push(
                    '/lms/transactions/renewMembership/scrutiny',
                  )
                }
              } else {
                swal('Record is Safe')
              }
            })
          }}
        >
          Exit
        </Button>
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
                <b>पावती</b>
                <h5>
                  (महाराष्ट्र ग्रंथालय अभ्यास केंद्र विनियमन नवीन सदस्य नोंदणी)
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex' }}>
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{this?.props?.dataa?.payment?.receiptDate}</b>
                  </h4>
                </div>

                <div style={{ display: 'flex' }}>
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
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.dataa?.applicationNumber}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: '1vh' }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>अर्ज दिनांक : </b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>
                      {' '}
                      {' ' +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          'YYYY-MM-DD',
                        ).format('DD-MM-YYYY')}
                    </b>{' '}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

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
              </div>
              <div className={styles.date4} style={{ marginTop: '2vh' }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: '40px' }}>
                    <b>ग्रंथालयच नाव :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.libraryName}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginTop: '2vh' }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: '40px' }}>
                    <b>सदस्यत्व क्र :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {this?.props?.dataa?.membershipNo}
                  </h4>
                </div>
              </div>
              {/* <div className={styles.date4} style={{ marginBottom: '1vh' }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>सदस्यत्व सुरू होण्याची तारीख  : </b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>
                      {' '}
                      {' ' +
                        moment(
                          this?.props?.dataa?.startDate,
                          'YYYY-MM-DD',
                        ).format('DD-MM-YYYY')}
                    </b>{' '}
                  </h4>
                </div>
              </div> */}

              <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>सदस्यत्व समाप्ती तारीख : </b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>
                      {' '}
                      {' ' +
                        moment(
                          this?.props?.dataa?.endDate,
                          'YYYY-MM-DD',
                        ).format('DD-MM-YYYY')}
                    </b>{' '}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <p>
                <h5 style={{ marginLeft: '40px', marginRight: '40px' }}>
                  <b>
                    पुढीलप्रमाणे फी मिळाली :-
                    <br />
                    <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}>शुल्काचे नाव</th>
                          <th colSpan={2}>रक्कम (रु)</th>
                        </tr>
                        <tr>
                          <td colSpan={4}>1)</td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.serviceNameMr}
                          </td>
                          <td colSpan={4}>
                            {this?.props?.dataa?.amount}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b>
                              एकूण रक्कम : {this?.props?.dataa?.amount}/-
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    सदस्यत्वाचे नूतनीकरण झालेल्याच्या दिनांक:{' '}
                    <b>
                      {' '}
                      {' ' +
                        moment(
                          this?.props?.dataa?.applicationDate,
                          'YYYY-MM-DD',
                        ).format('DD-MM-YYYY')}
                    </b>{' '}
                    <br />
                    {/* {this?.props?.dataa?.marriageDate} */}
                    ग्रंथालय अभ्यास केंद्र नोंदणी आकारण्यात येणारे सदस्यत्वाचे नूतनीकरण  
                  </b> &nbsp;
                  <b>एकूण शुल्क</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>{this?.props?.dataa?.amount} रु .</b>
                  <br />
                  <br />
                  <b>
                    {this?.props?.dataa?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची रक्कम प्राप्त झाली आहे. <br />
                    <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index
