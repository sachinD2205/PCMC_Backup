import React, { useEffect, useRef, useState } from 'react'
import styles from './acknowledgement.module.css'
import router, { useRouter } from 'next/router'
import { useReactToPrint } from 'react-to-print'
import { Button, Card } from '@mui/material'
import urls from '../../../../URLS/urls'
import axios from 'axios'
import moment from 'moment'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from "react-redux"

const Index = () => {
  const componentRef = useRef(null)
  const router = useRouter()
  const logedInUser = localStorage.getItem("loggedInUser")
  let user = useSelector((state) => state.user.user)

  const [data, setData] = useState(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'new document',
  })

  // get application details by application no
  useEffect(() => {
    if (router.query.id) {
      if (logedInUser === "citizenUser") {
        axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`, {
          headers: {
            UserId: user.id
          }
        },).then((r) => {
          setData(r.data)
        })
      } else {
        axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        },).then((r) => {
          setData(r.data)
        })
      }
    }
  }, [])

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push('/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList')
          }}>
          <FormattedLabel id="exit" />
        </Button>
      </div>
    </>
  )
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.mainn}>
        <div className={styles.main}>
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
                <b><FormattedLabel id="pimpariChinchwadMaha" /></b>
              </h1>
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
              <b><FormattedLabel id="appAcknowldgement" /></b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                  <FormattedLabel id="ackDear" />, <b>
                    {this?.props?.data?.applicantFirstName + " " + this?.props?.data?.applicantMiddleName + " " + this?.props?.data?.applicantLastName}</b>
                </h3>
                <h3><FormattedLabel id="ackpcmcthanku" /></h3>
                <h3>
                  <FormattedLabel id='ackshortDesc' />
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}><FormattedLabel id="ackApplicationSummery" /></h2>
            </div>
            <Card>
              <div className={styles.summ}>
                <div>
                  <h3><FormattedLabel id="applicationNo" /> </h3>
                  <h3><FormattedLabel id="applicantName" /> </h3>
                  <h3><FormattedLabel id="dateofApplication" /> </h3>
                  <h3><FormattedLabel id="address" /> </h3>
                </div>
                <div>
                  <h3> : {this?.props?.data?.applicationNo}</h3>
                  <h3>
                    {' '}
                    : <b>{this?.props?.data?.applicantFirstName + " " + this?.props?.data?.applicantMiddleName + " " + this?.props?.data?.applicantLastName}</b>
                  </h3>
                  <h3>
                    {' '}
                    :{' '}
                    {moment(this?.props?.data?.applicationDate).format(
                      'DD-MM-YYYY',
                    )}
                  </h3>
                  <h3>
                    : {this?.props?.data?.address}{' '}
                  </h3>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                <FormattedLabel id="ackplzContactNearestOperator" />
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5><FormattedLabel id="pimpariChinchwadMaha" /></h5>
                <h5> <FormattedLabel id="ackpcmcAddress" /></h5>
              </div>
              <div className={styles.add1}>
                <h5><FormattedLabel id="ackPcmcphNo" /></h5>
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                }}
              >
                <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                  marginRight: '5vh',
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
